const { default: mongoose } = require('mongoose')
const Order = require('../models/order.model')

// đếm số đơn hàng ở status pending của seller
const getPendingOrdersCount = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId
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

module.exports = { getPendingOrdersCount }