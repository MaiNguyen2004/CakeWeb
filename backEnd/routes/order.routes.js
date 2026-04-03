const express = require('express')
const route = express.Router()
const { getPendingOrdersCount } = require('../controllers/order.controller')

route.get('/seler/:sellerId/pending/count', getPendingOrdersCount)


module.exports = route
