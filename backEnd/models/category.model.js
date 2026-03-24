const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
            minLength: [2, "Name must be at least 2 characters"],
            maxLength: [100, "Name too long"]
        },

        description: {
            type: String,
            maxLength: [500, "Description too long"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categorySchema);