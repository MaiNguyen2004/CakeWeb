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
            .populate("categoryId", "name")
        if (products.length === 0) {
            return res.status(404).json({ message: "Không có sản phẩm nào" })
        }
        return res.status(200).json(products)

    } catch (error) {
        console.log("❌ ERROR:", error);

        next(error)
    }
}

const productfilter = async (req, res, next) => {
    try {
        const { sort } = req.query;

        let sortOption = { createdAt: -1 };

        switch (sort) {
            case "newest":
                sortOption = { createdAt: -1 };
                break;
            case "oldest":
                sortOption = { createdAt: 1 };
                break;
            case "price_asc":
                sortOption = { minPrice: 1 };
                break;
            case "price_desc":
                sortOption = { minPrice: -1 };
                break;
        }

        const products = await Product.aggregate([
            // 🔥 join category
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },

            // 🔥 tính minPrice
            {
                $addFields: {
                    minPrice: { $min: "$variants.price" }
                }
            },

            // 🔥 sort
            {
                $sort: sortOption
            },

            // 🔥 format lại dữ liệu
            {
                $project: {
                    _id: 0, // bỏ _id mặc định

                    id: "$_id",
                    name: 1,
                    slug: 1,
                    description: 1,

                    variants: {
                        $map: {
                            input: "$variants",
                            as: "v",
                            in: {
                                size: "$$v.size",
                                price: "$$v.price",
                                stock: "$$v.stock"
                            }
                        }
                    },

                    discount: "$discount.percent",

                    category: {
                        categoryId: "$category._id",
                        categoryName: "$category.name"
                    },

                    img: "$images",
                    tags: 1,
                    rating: 1
                }
            }
        ]);

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};


const bestSellingProductsTop6 = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "seller"
                }

            }, {
                $unwind: {
                    path: "$seller",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $addFields: {
                    minPrice: { $min: "$variants.price" }
                }
            }, {
                $sort: { totalSold: -1 }
            }, {
                $limit: 6
            }, {
                $project: {
                    _id: 0, // bỏ _id mặc định
                    id: "$_id",
                    name: 1,
                    img: "$images",
                    price: "$minPrice",
                    seller: "$seller.nickName",
                    totalSold: 1
                }
            }
        ])
        return res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}
module.exports = { productList, getProductBySellerId, productfilter, bestSellingProductsTop6 }



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