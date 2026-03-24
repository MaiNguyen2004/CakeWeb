const express = require('express')
const route = express.Router()

const { categoryName } = require('../controllers/category.controller')

route.get("/categoryName", categoryName)

module.exports = route