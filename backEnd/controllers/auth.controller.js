const User = require('../models/user.model.js')
const Role = require('../models/role.model.js')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt.js");

// ✅ REGISTER
const register = async (req, res) => {
    try {
        const { nickName, email, password, phone, roleId } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email hoặc số điện thoại đã tồn tại" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            nickName,
            email,
            password: hashedPassword,
            phone,
            roleId,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ✅ LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Authentication: check user exists
        const user = await User.findOne({ email }).populate("roleId");
        if (!user) return res.status(404).json({ message: "User not found" });
        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password" });

        // 3. Authorization: check role/permissions
        // Ví dụ: chỉ user có roleId tồn tại mới được login
        if (!user.roleId) return res.status(403).json({ message: "Role not assigned" });

        // 4. Generate JWT token
        const payload = {
            userId: user._id,
            role: user.roleId.name,  // send role name if needed
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // 5. Send token + user info to client
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                nickName: user.nickName,
                phone: user.phone,
                email: user.email,
                role: user.roleId.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// ✅ REFRESH TOKEN
const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken });
    });
};

const getUser = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("nickName email phone _id")
        if (users.length === 0) {
            return res.status(404).json({ message: "Not user" })
        }
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}
module.exports = { getUser, refreshToken, register, login }