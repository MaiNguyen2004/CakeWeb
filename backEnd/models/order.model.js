import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        products: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity must be at least 1"]
            }
        }],

        totalPrice: {
            type: Number,
            required: true,
            min: [0, "Total price must be >= 0"]
        },

        orderDate: {
            type: Date,
            default: Date.now
        },

        // 🔥 thêm để scale sau này
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"],
            default: "Pending"
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Credit Card", "PayPal", "Bank Transfer"],
            default: "COD"
        }
    },
    {
        timestamps: true
    }
);


// 🔥 index giúp query nhanh
orderSchema.index({ customerId: 1, orderDate: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;