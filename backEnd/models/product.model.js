const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      maxLength: 1000,
      trim: true
    },

    variants: [{
      _id: false,
      size: {
        type: String,
        required: true,
        trim: true // ví dụ: 15cm, 20cm, 30cm
      },

      price: {
        type: Number,
        required: true,
        min: 0
      },

      stock: {
        type: Number,
        min: 0
      }
    }],

    discount: {
      percent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },

      startDate: Date,
      endDate: Date,
    },

    images: [
      String
    ],

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tags: [String],
    stock: Number,

    rating: {
      type: Number,
      min: 0,
      default: 0
    },

    totalSold: {
      type: Number,
      min: 0,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);