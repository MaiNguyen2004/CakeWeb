const Role = require('../models/role.model')


const roleName = async (req, res, next) => {
    try {
        const roles = await Role.find().select("name")
        if (roles.length === 0) {
            return res.status(404).json({ message: "No role" })
        }
        return res.status(200).json(roles)

    } catch (error) {
        next(error)
    }
}
module.exports = { roleName }
