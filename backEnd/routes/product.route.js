const express = require('express')
const route = express.Router()
const { authorizeRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

const { productList, getProductBySellerId, productfilter, bestSellingProductsTop6 } = require('../controllers/product.controller')

route.get("/", productList)
route.get("/bestSellingProductsTop6", bestSellingProductsTop6)
route.get('/productSortby', productfilter)
route.get("/seller/:sellerId", verifyToken, authorizeRole("seller", "admin"), getProductBySellerId)
module.exports = route