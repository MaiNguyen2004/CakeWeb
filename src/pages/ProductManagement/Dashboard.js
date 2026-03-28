import React, { useState, useEffect } from "react";
import { FaCoins, FaExclamationTriangle, FaShoppingBag, FaEdit, FaTrash } from "react-icons/fa";

import { getProductsBySellerAPI } from '../../services/product.service'
import Sidebar from '../../components/Sidebar'
import Submit from '../../components/SubmitButton'
import SubmitButton from "../../components/SubmitButton";
import ButtonForm from "../../components/ButtonForm";

const StatCard = ({ title, value, extra, icon: Icon, bgColor, textColor, textSpan }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm w-full">
        <div className="flex justify-between items-center mb-2">
            <div className={`${bgColor} ${textColor} p-3 rounded-full`}>
                {Icon && <Icon size={20} />}
            </div>
            <div className={`${bgColor} ${textColor} p-1 rounded-xl `}>
                {extra && (
                    <span className={`${textSpan} text-md font-medium`}>
                        {extra}
                    </span>
                )}
            </div>

        </div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
    </div>
);

export default function Dashboard() {

    const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const data = await getProductsBySellerAPI(user.id);
            // console.log(data);
            setProducts(data)
        };

        fetchData();
    }, []);
    const getStatus = (stock, isActive = true) => {
        if (!isActive || stock === 0) {
            return { text: "Ngừng bán", color: "bg-gray-200 text-gray-600" };
        }
        if (stock <= 3) {
            return { text: "Sắp hết", color: "bg-red-100 text-red-600" };
        }
        return { text: "Đang bán", color: "bg-green-100 text-green-600" };
    };
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-50 p-6">
                {/* Top Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard
                        icon={FaCoins}
                        bgColor="bg-blue-200"
                        textColor="text-blue-800"
                        title="Tổng doanh thu"
                        value="45.280.000đ"
                        extra="+12.5%" />
                    <StatCard
                        icon={FaShoppingBag}
                        bgColor="bg-purple-100"
                        textColor="text-purple-800"
                        title="Đơn hàng mới"
                        value="128 đơn"
                        extra="24 mới" />

                    <StatCard
                        icon={FaExclamationTriangle}
                        bgColor="bg-red-200"
                        textColor="text-red-800"
                        title="Sản phẩm sắp hết"
                        value="05 bánh"
                        extra="Cảnh báo" />

                </div>

                {/* Product Table */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="font-semibold text-xl">Danh sách sản phẩm</h2>
                            <p className="text-gray-500">Quản lí kho hàng và trạng thái hiển thị của các loại bánh</p>
                        </div>
                        <div className="m-4">
                            <SubmitButton text="Thêm sản phẩm mới" />
                        </div>
                        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Thêm sản phẩm mới
                        </button> */}
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <h2 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h2>

                        {/* Header */}
                        <div className="grid grid-cols-8 gap-4 font-semibold text-gray-600 border-b pb-2">
                            <div>Tên sản phẩm</div>
                            <div>Danh mục</div>
                            <div>Size</div>
                            <div>Giá</div>
                            <div>Số lượng còn</div>
                            <div>Trạng thái</div>
                            <div>Hành động</div>
                        </div>

                        {/* Body */}
                        {products.map((product) => (
                            product.variants.map((item, index) => (
                                <div
                                    key={`${product._id}-${index}`}
                                    className="grid grid-cols-8 gap-4 py-3 border-b items-center"
                                >
                                    <div>{product.name}</div>
                                    <div>{product.categoryId.name}</div>
                                    <div className="font-medium text-blue-600">
                                        {item.size}
                                    </div>

                                    {/* Price */}
                                    <div className="text-green-600 font-semibold">
                                        {item.price.toLocaleString()}đ
                                    </div>
                                    <div className="font-medium text-blue-600">
                                        {item.stock}
                                    </div>
                                    <div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatus(item.stock, product.isActive).color}`}>
                                            {getStatus(item.stock, product.isActive).text}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="text-blue-500 hover:text-blue-700 text-lg">
                                            <FaEdit />
                                        </button>

                                        <button className="text-red-500 hover:text-red-700 text-lg">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}
