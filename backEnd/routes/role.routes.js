const express = require('express')
const route = express.Router()

const { roleName } = require('../controllers/role.controller')

route.get("/roleName", roleName)

module.exports = route