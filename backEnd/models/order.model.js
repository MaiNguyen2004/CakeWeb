const mongoose = require('mongoose')

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
            size: {
                type: String,
                required: true,
                trim: true
            },
            price: {
                type: Number,
                required: true,
                min: [0, "Price must be >= 0"]
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

        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipping", "Completed", "Cancelled"],
            default: "Pending"
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Credit Card", "PayPal", "Bank Transfer"],
            default: "COD"
        },
        deliveryMethod: {
            type: String,
            enum: ["Home Delivery", "Store Pickup"],
            default: "Home Delivery"
        },
        orderedDate: {
            type: Date,
        },
        requestedDeliveryTime: {
            type: Date
        },
        deliveredAt: {
            type: Date,
        },
        receiverAdress: String,
        receivedAt: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
