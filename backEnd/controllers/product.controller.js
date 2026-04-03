const Product = require('../models/product.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')


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
        const totalRevenue = products.reduce((sum, product) => sum + product.totalSold, 0)
        return res.status(200).json({
            products,
            totalRevenue

        })

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


const addProduct = async (req, res, next) => {
    try {
        const sellerId = req.user.userId
        const { name, slug, description, variants, stock, discount, categoryId, images, tags, isActive } = req.body

        //0. check seller
        const seller = await User.findById(sellerId)
        if (!seller) {
            return res.status(404).json({ message: "Người dùng chưa tồn tại." })
        }
        // 1. check các trường bắt buộc
        if (name.trim().length === 0
            || slug.trim().length === 0
            || variants.length === 0
            || !categoryId
            || images.length === 0
            || !sellerId) {
            return res.status(404).json({ message: "Tên sản phẩm không được để trống." })
        }

        // 2. check độ dài tên sản phẩm < 100 ký tụ
        if (name.trim().length > 100) {
            return res.status(404).json({ message: "Tên sản phẩm vượt quá 100 ký tự cho phép." })
        }

        // 3. check slug existed?
        const product = await Product.findOne({ slug: slug })
        if (product) return res.status(404).json({ message: "Mã định danh sản phẩm đã tồn tại." })

        // 4. check độ dài mô tả sản phẩm < 1000 ký tả
        if (description.trim().length > 1000) {
            return res.status(404).json({ message: "Mô tả sản phẩm vượt quá 1000 ký tự cho phép." })
        }

        // 5. check size and price
        for (const variant of variants) {
            if (variant.size.length > 10) {
                return res.status(404).json({ message: "Kích thước sản phẩm vượt quá 10 ký tự cho phép." })
            }
            if (Number(variant.price) < 0) {
                return res.status(404).json({ message: "Giá sản phẩm vượt phải lớn hơn 0." })
            }
        }

        //6. check stock
        if (Number(stock) < 0) {
            return res.status(404).json({ message: "Số lượng còn sản phẩm vượt phải lớn hơn 0." })
        }

        //7. check discount
        if (Number(discount.percent) < 0 || Number(discount.percent) > 100) {
            return res.status(404).json({ message: "Mã giảm giá sản phẩm chỉ nằm trong khoảng 0 đến 100." })
        }
        if (discount.startDate > discount.endDate) {
            return res.status(404).json({ message: "Ngày bắt đầu giảm giá phải trước ngày kết thúc giảm giá." })

        }

        const addProduct = await Product.create({
            name, slug, description, variants, stock, discount, categoryId, images, sellerId, tags, isActive: true
        })
        return res.status(200).json(addProduct)
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const getProductBySellerById = async (req, res, next) => {
    try {
        const sellerId = req.user.userId
        const productId = req.params.productId
        const seller = await User.findById(sellerId)
        if (!seller) {
            return res.status(404).json({ message: "Nguời bán không tồn tại." })
        }
        const product = await Product.findOne({ _id: productId, sellerId: sellerId })
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại." })
        }
        return res.status(200).json(product)

    } catch (error) {
        next(error)
    }
}



module.exports = { productList, getProductBySellerId, productfilter, bestSellingProductsTop6, addProduct, getProductBySellerById }





// const productList = async(req,res,next)=>{
//     try {

//     } catch (error) {
//         next(error)
//     }
// }