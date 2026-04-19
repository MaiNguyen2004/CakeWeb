const express = require('express')
const route = express.Router()
const { authorizeRole, authorizeSelfOrRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

const { addCart, getCart } = require('../controllers/cart.controller')

route.get("/", verifyToken, getCart)
route.post("/add", verifyToken, addCart)

module.exports = route