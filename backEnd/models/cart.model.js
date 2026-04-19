const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true // mỗi user chỉ có 1 cart
        },

        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            size: {
                type: String,
                required: true,
                trim: true
            },

            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity must be at least 1"],
                default: 1
            },

            // 🔥 giá tại thời điểm thêm vào giỏ
            price: {
                type: Number,
                required: true,
                min: [0, "Price must be >= 0"]
            },
            _id: false
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("carts", cartSchema)