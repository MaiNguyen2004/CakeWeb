const express = require('express')
const router = express.Router()
const { register, login, refreshToken, getUsers, bestSellerTop10,
    getUserCurrently
} = require("../controllers/auth.controller.js");
const { verifyToken } = require('../middleware/auth.middleware.js')
const { authorizeRole } = require('../middleware/role.middleware.js')


router.get("/bestSellerTop10", bestSellerTop10);
router.get("/me", verifyToken, getUserCurrently)
router.get("/getUsers", verifyToken, authorizeRole("admin"), getUsers)
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

module.exports = router