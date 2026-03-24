const express = require('express')
const router = express.Router()
const { register, login, refreshToken, getUser } = require("../controllers/auth.controller.js");
const { verifyToken } = require('../middleware/auth.middleware.js')
const { authorizeRole } = require('../middleware/role.middleware.js')

router.get("/getUsers", verifyToken, authorizeRole("admin"), getUser)
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

module.exports = router