const express = require('express')
const route = express.Router()
const { authorizeRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

const { productList, getProductBySellerId, productfilter, bestSellingProductsTop6, addProduct, getProductBySellerById } = require('../controllers/product.controller')

route.get("/", productList)
route.get("/bestSellingProductsTop6", bestSellingProductsTop6)
route.get('/productSortby', productfilter)
route.get('/update/:productId', verifyToken, authorizeRole("seller", "admin"), getProductBySellerById)

route.get("/seller/:sellerId", verifyToken, authorizeRole("seller", "admin"), getProductBySellerId)
route.post("/create", verifyToken, authorizeRole("seller", "admin"), addProduct)

module.exports = route