const Product = require('../models/product.model')
const Category = require('../models/category.model')

const productList = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate("categoryId", "_id name")
        if (products.length === 0) {
            return res.status(404).json({ message: "No products" })
        }
        const format = products.map(product => ({
            id: product._id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            variants: product.variants.map(v => ({
                size: v.size,
                price: v.price,
                stock: v.stock
            })),
            discount: product.discount.percent,
            category: {
                categoryId: product.categoryId._id,
                categoryName: product.categoryId.name
            },
            img: product.images,
            tags: product.tags,
            rating: product.rating,

        }))
        return res.status(200).json(format)

    } catch (error) {
        console.log("❌ ERROR:", error);
        next(error)
    }
}

const getProductBySellerId = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId
        const products = await Product.find({ sellerId: sellerId })
        if (products.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào" })
        }
        return res.status(200).json(products)

    } catch (error) {
        console.log("❌ ERROR:", error);

        next(error)
    }
}
module.exports = { productList, getProductBySellerId }

// const productList = async(req,res,next)=>{
//     try {

//     } catch (error) {
//         next(error)
//     }
// }

// const productList = async(req,res,next)=>{
//     try {

//     } catch (error) {
//         next(error)
//     }
// }


// const productList = async(req,res,next)=>{
//     try {

//     } catch (error) {
//         next(error)
//     }
// }

// const productList = async(req,res,next)=>{
//     try {

//     } catch (error) {
//         next(error)
//     }
// }

// const productList = async(req,res,next)=>{
//     try {

//     } catch (error) {
//         next(error)
//     }
// }