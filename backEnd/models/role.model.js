const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["admin", "seller", "shipper", "buyer"],
      unique: true
    },
    description: {
      type: String,
      default: ""
    },
    permissions: {
      type: [String], // mảng string
      required: true,
      default: []
    }
  },
  {
    timestamps: true // tự tạo createdAt, updatedAt
  }
);

module.exports = mongoose.model("Role", roleSchema);
