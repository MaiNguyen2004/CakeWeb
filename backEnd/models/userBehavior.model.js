import mongoose from "mongoose";

const userBehaviorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true
        },

        action: {
            type: String,
            enum: ["view", "add_to_cart", "purchase", "favorite"],
            required: true
        },

        // 🔥 điểm phục vụ AI
        score: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        timestamps: true // createdAt rất quan trọng cho AI
    }
);


// 🔥 index tối ưu query recommend
userBehaviorSchema.index({ userId: 1, productId: 1 });
userBehaviorSchema.index({ userId: 1, createdAt: -1 });


// 🔥 auto set score theo action
userBehaviorSchema.pre("save", function (next) {
    const ACTION_SCORE = {
        view: 1,
        add_to_cart: 3,
        purchase: 5,
        favorite: 4
    };

    this.score = ACTION_SCORE[this.action] || 1;

    next();
});


const UserBehavior = mongoose.model("UserBehavior", userBehaviorSchema);

export default UserBehavior;