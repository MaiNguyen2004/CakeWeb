const Category = require('../models/category.model')


const categoryName = async (req, res, next) => {
    try {
        const categories = await Category.find().select(" name")
        if (categories.length === 0) {
            return res.status(404).json({ message: "No category" })
        }
        return res.status(200).json(categories)

    } catch (error) {
        next(error)
    }
}
module.exports = { categoryName }
