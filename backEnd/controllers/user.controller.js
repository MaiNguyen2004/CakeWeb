const { default: mongoose } = require('mongoose')
const User = require('../models/user.model')
const express = require('express')
const route = express.Router()

const updateProfile = async (req, res, next) => {
    try {
        const id = req.params.id
        console.log("id: ", id)
        const { nickName, avatar, address, phone, bio } = req.body

        // 1. Validate Id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: `Invalid userId : ${id}`
            })
        }

        // 2. check user existed
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                error: `User with Id : ${id} not found`
            })
        }
        // 3. Validate phone (9–11 số) 
        if (phone && (phone.length < 9 || phone.length > 11)) {
            return res.status(400).json({
                message: `Số điện thoại có độ dài 9 đến 11 chữ số.`
            })
        }
        // 4. update    
        const update = await User.findByIdAndUpdate(id, {
            nickName, avatar, address, phone, bio
        }, { new: true })

        return res.status(200).json({
            message: `Cập nhật người dùng thành công!`,
            user: update
        })
    } catch (error) {
        console.log("err: ", error.message)
        // next(error)
    }
}

module.exports = {
    updateProfile
}