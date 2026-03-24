import mongoose from "mongoose";

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
                min: [1, "Quantity must be at least 1"]
            },

            // 🔥 giá tại thời điểm thêm vào giỏ
            price: {
                type: Number,
                required: true,
                min: [0, "Price must be >= 0"]
            }
        }]
    },
    {
        timestamps: true
    }
);


// 🔥 index giúp query nhanh
cartSchema.index({ userId: 1 });


// 🔥 virtual: tổng tiền giỏ hàng
cartSchema.virtual("totalPrice").get(function () {
    return this.items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
});


const Cart = mongoose.model("Cart", cartSchema);

export default Cart;