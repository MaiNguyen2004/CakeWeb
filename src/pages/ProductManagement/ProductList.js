import CardProduct from "../../components/ui/CardProduct";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsAPI, getProductsSortAPI, bestSellingProductsTop6 } from "../../services/product.service"
import { getCategoriesAPI } from "../../services/category.service";
import { bestSellerTop10 } from "../../services/user.service";

import Dropdown from '../../components/common/DropdownForm'
const ProductList = () => {
    const [products, setProducts] = useState([])
    const [bestSoldProducts, setBestSoldProducts] = useState([])
    const [bestSellers, setBestSellers] = useState([])
    const [cateName, setCateName] = useState([])
    const [active, setActive] = useState("Tất cả");
    const navigation = useNavigate()
    const options = [
        { _id: "newest", name: "Mới nhất" },
        { _id: "oldest", name: "Cũ nhất" },
        { _id: "price_asc", name: "Giá tăng dần" },
        { _id: "price_desc", name: "Giá giảm dần" }
    ];

    const [sortValue, setSortValue] = useState("");
    useEffect(() => {
        const fetchdata = async () => {
            const cate = await getCategoriesAPI()
            setCateName(cate)
            const bestSoldPro = await bestSellingProductsTop6()
            setBestSoldProducts(bestSoldPro)
            const bestSeller = await bestSellerTop10()
            setBestSellers(bestSeller)
        }
        fetchdata()
    }, [])
    useEffect(() => {
        const fetchProducts = async () => {
            let data;
            if (sortValue) {
                data = await getProductsSortAPI(sortValue);
            } else {
                data = await getProductsAPI();
            }
            setProducts(data);
        };

        fetchProducts();
    }, [sortValue]);
    const filteredProducts =
        active === "Tất cả"
            ? products
            : products.filter(p => p.category.categoryName === active);
    return (
        <div className="bg-gray-50">
            <Header />
            <div className="flex mx-10 mt-4 gap-6">
                <div className="w-1/5 ">
                    {/* product có số lượng mua/bán nhiều nhất */}
                    <div className="flex flex-col gap-6">
                        {bestSoldProducts.map((cake, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 bg-white rounded-xl p-2  shadow-sm hover:shadow-md hover:bg-gray-50 transition cursor-pointer"
                            >
                                {/* Image */}
                                <img
                                    src={cake.img}
                                    className="rounded-lg h-20 w-20 object-cover flex-shrink-0"
                                />

                                {/* Content */}
                                <div className="flex flex-col justify-between flex-1">
                                    {/* Name */}
                                    <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                                        {cake.name}
                                    </h3>

                                    {/* Price */}
                                    <p className="text-blue-500 text-sm font-semibold mt-1">
                                        {cake.price}
                                    </p>

                                    {/* Seller + Sold */}
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Sweet Bakery</span>
                                        <span>Đã bán {cake.totalSold}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Shop ban chay */}
                    <div className="mt-4 overflow-hidden">
                        <h5 className="mb-3 font-semibold">CỬA HÀNG BÁN CHẠY</h5>

                        <div className="flex gap-4 bg-white rounded-xl">
                            {bestSellers.map((seller, i) => (
                                <div
                                    key={i}
                                    className="min-w-[120px] animate-scroll-x flex flex-col items-center py-3 px-2 cursor-pointer"
                                >
                                    <img
                                        src={seller.avatar}
                                        className=" h-16 w-24 object-cover mb-2 hover:shadow-md hover:bg-gray-50"
                                    />
                                    <p className="text-sm text-center font-medium">
                                        {seller.seller}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* container */}
                <div className="w-4/5">
                    <div className="flex  bg-white rounded-xl shadow-sm px-2 items-center">

                        {/* Tabs */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setActive("Tất cả")}
                                className={`px-4 py-2 rounded-full
                            ${active === "Tất cả" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            >
                                Tất cả
                            </button>

                            {cateName.map((item) => (
                                <button
                                    key={item._id}
                                    onClick={() => setActive(item.name)}
                                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all
                                ${active === item.name
                                            ? "bg-blue-500 text-white shadow"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="ml-auto w-48 m-3">
                            <Dropdown
                                data={options}
                                labelKey="name"
                                valueKey="_id"
                                placeholder="Sắp xếp"
                                value={sortValue}
                                onChange={setSortValue}
                            />
                        </div>

                    </div>
                    <section className="px-10 py-10">
                        <h2 className="text-2xl font-semibold mb-6">Sản phẩm</h2>

                        <div className="grid grid-cols-4 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item, index) => (
                                    <CardProduct key={index} product={item} />
                                ))
                            ) : (
                                <div className="col-span-4 flex flex-col items-center justify-center py-20 text-gray-400 text-center">
                                    <span className="text-5xl mb-3">📦</span>
                                    <h2 className="text-lg font-medium">
                                        Không có sản phẩm nào!
                                    </h2>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <div className="w-1/5">
                </div>
            </div>
            <Footer />

        </div>
    );
};

export default ProductList;