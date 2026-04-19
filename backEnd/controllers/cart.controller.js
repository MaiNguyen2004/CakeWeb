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
        if (!cart) {
            return res.status(404).json({
                error: ` Cart empty.`
            })
        }
        return res.status(200).json(cart)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addCart,
    getCart
}