const { default: mongoose } = require('mongoose')
const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const User = require('../models/user.model')

const addCart = async (req, res, next) => {
    try {
        const { productId, size, quantity } = req.body

        // 1. check valid productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                error: `Invalid productId: ${productId}`
            })
        }
        // 2. Product tồn tại
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                error: `Product with Id: ${productId} not found`
            })
        }
        // 3. size tồn tại
        const variant = product.variants.find(
            v => v.size.toString() === size.toString()
        )

        if (!variant) {
            return res.status(400).json({
                error: "Kích thước sản phẩm không tồn tại"
            })
        }

        // 4. stock >= quantity
        if (variant.stock < quantity) {
            return res.status(404).json({
                message: `Số lượng sản phẩm không đủ.`
            })
        }

        const userId = req.user.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                error: `User with Id ${userId} not found`
            })
        }
        // 5. find cart
        let cart = await Cart.findOne({ userId: userId })
        // 6. nếu chưa có cart → tạo mới
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: []
            })
        }

        // 7. check item đã tồn tại chưa
        const existingItem = cart.items.find(item =>
            item.productId.toString() === productId.toString()
            && item.size === size
        )
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({
                productId,
                size,
                quantity,
                price: variant.price
            })
        }

        await cart.save()
        return res.status(201).json({
            message: "Added to cart",
            cart
        })
    } catch (error) {
        next(error)
    }
}

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                error: `User with id: ${userId}`
            })
        }
        const cart = await Cart.findOne({ userId: userId })
            .populate("items.productId", "name images variants")
        if (!cart) {
            return res.status(404).json({
                error: ` Cart empty.`
            })
        }
        const result = cart.items.map(item => {
            const productId = item.productId?._id?.toString?.() ?? item.productId?.toString?.()
            return {
                id: `${productId}-${item.size}`,
                productId,
                name: item.productId?.name,
                image: item.productId?.images?.[0],
                availableSizes: (item.productId?.variants ?? []).map((variant) => variant.size),
                size: item.size,
                quantity: item.quantity,
                price: item.price
            }
        })
        return res.status(200).json({ items: result })
    } catch (error) {
        next(error)
    }
}

const removeProductInCartItem = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { productId } = req.body

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: `Invalid productId: ${productId}` })
        }

        const cart = await Cart.findOne({ userId: userId })
        if (!cart) {
            return res.status(404).json({ error: "Cart not found." })
        }

        const previousLength = cart.items.length
        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        )

        if (cart.items.length === previousLength) {
            return res.status(404).json({ error: "Product not exist in cart." })
        }

        await cart.save()
        return res.status(200).json({ message: "Removed item from cart", cart })
    } catch (error) {
        next(error)
    }
}

const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const { productId, size, quantity } = req.body

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: `Invalid productId: ${productId}` })
        }

        const parsedQuantity = Number(quantity)
        if (!size) {
            return res.status(400).json({ error: "Size is required." })
        }
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ error: "Quantity must be an integer >= 1." })
        }

        const cart = await Cart.findOne({ userId })
        if (!cart) {
            return res.status(404).json({ error: "Cart not found." })
        }

        let item = cart.items.find(
            (cartItem) =>
                cartItem.productId.toString() === productId.toString() &&
                cartItem.size === size
        )

        if (!item) {
            // Trường hợp đổi size: request gửi size mới nên chưa match item hiện tại.
            item = cart.items.find(
                (cartItem) => cartItem.productId.toString() === productId.toString()
            )
        }

        if (!item) {
            return res.status(404).json({ error: "Item not found in cart." })
        }
        const product = await Product.findById(item.productId)
        if (!product) {
            return res.status(404).json({ error: "Product not found." })
        }

        const targetVariant = product.variants.find(
            (variant) => variant.size.toString() === size.toString()
        )
        if (!targetVariant) {
            return res.status(404).json({ error: "Product variant not found." })
        }

        if (parsedQuantity > Number(targetVariant.stock ?? 0)) {
            return res.status(400).json({
                error: "Sản phẩm không đủ số lượng."
            })
        }

        item.quantity = parsedQuantity
        item.price = targetVariant.price

        await cart.save()

        return res.status(200).json({
            message: "Updated cart item",
            item: {
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addCart,
    getCart,
    removeProductInCartItem,
    updateCartItem
}