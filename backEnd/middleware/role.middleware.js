const User = require('../models/user.model')

const authorizeRole = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId).populate("roleId");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!roles.includes(user.roleId.name)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};

const authorizeSelfOrRole = (roles) => {
    return async (req, res, next) => {

        try {
            const user = await User.findById(req.user.userId)
                .populate("roleId", "_id name")

            if (!user) {
                return res.status(404).json({
                    message: `User with id ${req.user.userId} not found`
                })
            }
            const isAdmin = roles.includes(user.roleId.name)
            const isOwner = req.user.userId.toString() === req.params.id
            if (!isAdmin && !isOwner) {
                return res.status(403).json({
                    message: `Forbidden`
                })
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}


module.exports = { authorizeRole, authorizeSelfOrRole }