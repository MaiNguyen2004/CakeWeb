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

//create category
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body
        if (name.length < 2) {
            return res.status(404).json({
                message: `Độ dài tên danh mục phải lớn hơn 2 kí tự. `
            })
        }
        const categoryExisted = await Category.findOne({ name: name })
        if (categoryExisted) {
            return res.status(404).json({
                message: `Tên danh mục đã tồn tại`
            })
        }

        const category = await Category.create({ name, description })
        return res.status(201).json({
            message: "Tạo danh mục thành công",
            category
        })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    categoryName,
    createCategory
}
