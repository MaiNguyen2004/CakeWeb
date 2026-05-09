const { default: mongoose } = require('mongoose')
const Order = require('../models/order.model')
const Product = require('../models/product.model')
const User = require('../models/user.model')

// đếm số đơn hàng ở status pending của seller
const getPendingOrdersCount = async (req, res, next) => {
    try {
        const sellerId = req.user.userId
        const totalOrderPending = await Order.aggregate([
            //1. only get pending status
            {
                $match: {
                    status: "Pending"
                }
            },
            // 2. tách từng product trong order
            {
                $unwind: "$products"
            },
            // 3. join product
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "product"
                }
            }, {
                $unwind: "$product"
            },
            // 4. lọc theo seller
            {
                $match: {
                    "product.sellerId": new mongoose.Types.ObjectId(sellerId)
                }
            },
            // 5. đếm tổng
            {
                $count: "total"
            }
        ])
        return res.status(200).json({
            sellerId: sellerId,
            total: totalOrderPending[0]?.total || 0
        })
    } catch (error) {
        console.log("error: ", error)
        next(error)
    }
}

const createOrder = async (req, res, next) => {
    try {
        const customerId = req.user.userId
        const { items, paymentMethod, deliveryMethod, requestedDeliveryTime, receiverAddress } = req.body
        const orderedDate = new Date()

        if (!items || items.length === 0) {
            return res.status(400).json({
                error: "Vui lòng lựa chọn sản phẩm."
            })
        }

        let parsedRequestedDeliveryTime
        if (requestedDeliveryTime) {
            parsedRequestedDeliveryTime = new Date(requestedDeliveryTime)
            if (Number.isNaN(parsedRequestedDeliveryTime.getTime())) {
                return res.status(400).json({
                    error: "requestedDeliveryTime không hợp lệ."
                })
            }

            const minRequestedTime = new Date(orderedDate.getTime() + 60 * 60 * 1000)
            if (parsedRequestedDeliveryTime < minRequestedTime) {
                return res.status(400).json({
                    error: "requestedDeliveryTime phải sau orderedDate ít nhất 1 giờ."
                })
            }
        }

        let itemList = []
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ error: `Invalid productId: ${item.productId}` })
            }
            const product = await Product.findById(item.productId)
            if (!product) {
                return res.status(404).json({ error: "Product not found" })
            }
            const parsedQuantity = Number(item.quantity)
            if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
                return res.status(400).json({ error: "Quantity must be an integer >= 1" })
            }
            if (!item.size) {
                return res.status(400).json({ error: "Size is required" })
            }

            const existedPendingOrder = await Order.findOne({
                customerId,
                status: "Pending",
                products: {
                    $elemMatch: {
                        productId: item.productId,
                        size: item.size
                    }
                }
            }).sort({ createdAt: -1 })

            if (existedPendingOrder) {
                const orderedAt = new Date(existedPendingOrder.createdAt).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour12: false,
                    timeZone: "Asia/Ho_Chi_Minh"
                })

                return res.status(409).json({
                    error: `Bạn đã đặt sản phẩm lúc ${orderedAt} giờ.`
                })
            }

            const variant = product.variants.find((v) => v.size.toString() === item.size.toString())
            if (!variant) {
                return res.status(404).json({ error: "Product variant not found" })
            }
            if (variant.stock < parsedQuantity) {
                return res.status(400).json({ error: "Sản phẩm không đủ số lượng tồn kho." })
            }
            itemList.push({
                productId: item.productId,
                size: item.size,
                price: product.variants.find(variant => variant.size === item.size).price,
                quantity: item.quantity
            })
            variant.stock -= parsedQuantity
            await product.save()

        }

        const totalPrice = itemList.reduce((sum, item) => sum += item.price, 0)

        const user = await User.findById(req.user.userId)
        // if (!user) {
        //     return res.status(404).json({ error: "User not found" })
        // }
        // if (user.address !== receiverAddress || user.address == null || !user.address) {
        //     user.address = receiverAddress
        //     await user.save()
        // }

        const order = await Order.create({
            customerId: req.user.userId,
            products: itemList,
            deliveryMethod,
            paymentMethod,
            totalPrice,
            requestedDeliveryTime: parsedRequestedDeliveryTime,
            receiverAdress: receiverAddress,
            orderedDate
        })

        await order.populate({ path: "products.productId", select: "name images" })
        const productsPayload = order.products.map(product => ({
            productName: product.productId.name,
            image: product.productId.images[0],
            quantity: product.quantity,
            price: product.price
        }))

        return res.status(201).json({
            message: "Đặt hàng thành công",
            order: {
                orderId: order._id,
                products: productsPayload,
                totalProduct: productsPayload.length,
                totalPrice: order.totalPrice,
                requestedDeliveryTime: order.requestedDeliveryTime,
                orderedDate: order.orderedDate,
            },
            receiver: {
                nickName: user.nickName,
                address: order.receiverAdress,
            }
        })
    } catch (error) {
        next(error)
    }
}

const getOrderHistory = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const orderHistory = await Order.find({ customerId: req.user.userId })
            .populate("products.productId", "images")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
        const totalOrder = orderHistory.length
        const orders = orderHistory.map(order => ({
            image: order.products[0]?.productId.images[0],
            orderId: order._id,
            orderedDate: order.orderedDate,
            totalPrice: order.totalPrice,
            status: order.status

        }))
        return res.status(200).json({
            orders,
            totalOrderStatus: {
                pendingOrder: orderHistory.filter(order => order.status === "Pending").length,
                processingOrder: orderHistory.filter(order => order.status === "Processing").length,
                shippingOrder: orderHistory.filter(order => order.status === "Shipping").length,
                completedOrder: orderHistory.filter(order => order.status === "Completed").length,
                cancelOrder: orderHistory.filter(order => order.status === "Cancelled").length,
            },
            total: totalOrder,
            currentPage: page,
            totalPages: Math.ceil(totalOrder / limit)
        })
    } catch (error) {
        next(error)
    }
}

const orderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.orderId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: "orderId không hợp lệ" })
        }

        const orderDetail = await Order.findOne({
            _id: orderId,
            customerId: req.user.userId
        })
            .populate({
                path: "products.productId",
                select: "images name categoryId",
                populate: {
                    path: "categoryId",
                    select: "name"
                }
            })

        if (!orderDetail) {
            return res.status(404).json({ error: "Không tìm thấy đơn hàng" })
        }

        const customer = await User.findById(req.user.userId)
        const order = {
            orderId: orderDetail._id,
            orderedDate: orderDetail.orderedDate,
            status: orderDetail.status,
            paymentMethod: orderDetail.paymentMethod,
            products: orderDetail.products.map(product => ({
                img: product.productId.images[0],
                category: product.productId.categoryId.name,
                name: product.productId.name,
                size: product.size,
                quantity: product.quantity,
                price: product.price
            })),
            totalPrice: orderDetail.totalPrice,
            receiver: {
                receiverName: customer.nickName,
                phone: customer.phone,
                receiverAddress: orderDetail.receiverAdress
            }
        }
        return res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getPendingOrdersCount, createOrder, getOrderHistory,
    orderDetails
}