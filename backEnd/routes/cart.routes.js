const express = require('express')
const route = express.Router()
const { authorizeRole, authorizeSelfOrRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

const { addCart, getCart, removeProductInCartItem, updateCartItem } = require('../controllers/cart.controller')

route.get("/:userId", verifyToken, getCart)
route.post("/add", verifyToken, addCart)
route.delete("/remove", verifyToken, removeProductInCartItem)
route.patch("/updateCard", verifyToken, updateCartItem)

module.exports = route