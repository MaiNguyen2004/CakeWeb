const express = require('express')
const route = express.Router()
const { authorizeRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

const { productList,
    getProductBySellerId,
    productfilter,
    bestSellingProductsTop6,
    addProduct,
    getProductBySellerById,
    updateProduct,
    deleteProduct } = require('../controllers/product.controller')

route.get("/", productList)
route.get("/bestSellingProductsTop6", bestSellingProductsTop6)
route.get('/productSortby', productfilter)
route.get('/getProduct/:productId', verifyToken, authorizeRole("seller", "admin"), getProductBySellerById)
route.get("/seller/:sellerId", verifyToken, authorizeRole("seller", "admin"), getProductBySellerId)
route.put("/updateProduct/:productId", verifyToken, authorizeRole("seller", "admin"), updateProduct)
route.delete("/deleteProduct/:productId", verifyToken, authorizeRole("seller", "admin"), deleteProduct)

route.post("/newProduct", verifyToken, authorizeRole("seller", "admin"), addProduct)

module.exports = route