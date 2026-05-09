const express = require('express')
const route = express.Router()
const { getPendingOrdersCount, createOrder, getOrderHistory,
    orderDetails
} = require('../controllers/order.controller')
const { verifyToken } = require('../middleware/auth.middleware')

route.get('/seller/pending/count', verifyToken, getPendingOrdersCount)
route.post('/', verifyToken, createOrder)
route.get('/orderHistory', verifyToken, getOrderHistory)
route.get('/:orderId/orderDetail', verifyToken, orderDetails)

module.exports = route
