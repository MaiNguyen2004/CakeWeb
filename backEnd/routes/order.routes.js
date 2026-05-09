const express = require('express')
const route = express.Router()
const { getPendingOrdersCount, createOrder } = require('../controllers/order.controller')
const { verifyToken } = require('../middleware/auth.middleware')

route.get('/seller/pending/count', verifyToken, getPendingOrdersCount)
route.post('/', verifyToken, createOrder)


module.exports = route
