const { updateProfile } = require('../controllers/user.controller')
const express = require('express')
const route = express.Router()
const { authorizeRole, authorizeSelfOrRole } = require('../middleware/role.middleware')
const { verifyToken } = require('../middleware/auth.middleware')

route.put('/:id', verifyToken, authorizeSelfOrRole(["admin"]), updateProfile)

module.exports = route