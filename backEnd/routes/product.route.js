const express = require('express')
const route = express.Router()
const { authorizeRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

const { productList, getProductBySellerId } = require('../controllers/product.controller')

route.get("/", productList)
route.get("/:sellerId", verifyToken, authorizeRole("seller", "admin"), getProductBySellerId)

module.exports = route