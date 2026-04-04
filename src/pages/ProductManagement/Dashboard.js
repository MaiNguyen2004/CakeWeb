import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { FaCoins, FaExclamationTriangle, FaShoppingBag, FaEdit, FaPlus, FaTrash } from "react-icons/fa";

import { getProductsBySellerAPI, deleteProductByIdAPI } from '../../services/product.service'
import { pendingOrdersCountBySeller } from '../../services/order.service'

import Sidebar from '../../components/layout/Sidebar'
import HeaderDashboard from '../../components/layout/HeaderDashboard'
import { toast } from "react-toastify";

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
    const navigate = useNavigate()
    const [dataProducts, setDataProducts] = useState(0);
    const [totalOrderPendingStatus, setTotalOrderPendingStatus] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const data = await getProductsBySellerAPI(user.id);
            // console.log(data);
            setDataProducts(data)

            const dataTotal = await pendingOrdersCountBySeller(user.id)
            setTotalOrderPendingStatus(dataTotal.total)
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

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProductByIdAPI(productId); // gọi API xóa

            // Cập nhật state đúng
            setDataProducts(prev => ({
                ...prev, // giữ các field khác như totalRevenue
                products: prev.products.filter(p => p._id !== productId)
            }));

            // Reset product đã chọn
            setSelectedProduct(null);
            setShowDeleteModal(false);

            toast.success("Xóa sản phẩm thành công");
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className='flex-1'>
                <HeaderDashboard
                    title="Quản lý sản phẩm"
                />
                <div className="bg-gray-50 p-4 min-h-screen">
                    {/* Top Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <StatCard
                            icon={FaCoins}
                            bgColor="bg-blue-200"
                            textColor="text-blue-800"
                            title="Tổng doanh thu"
                            value={dataProducts.totalRevenue}
                            extra="+12.5%" />
                        <StatCard
                            icon={FaShoppingBag}
                            bgColor="bg-purple-100"
                            textColor="text-purple-800"
                            title="Đơn hàng mới"
                            value={totalOrderPendingStatus}
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
                    <div className="flex justify-between items-center mb-4 bg-white rounded-xl shadow-sm p-4">
                        <div>
                            <h2 className="font-bold text-xl">Danh sách sản phẩm</h2>
                            <p className="text-gray-500">Quản lí kho hàng và trạng thái hiển thị của các loại bánh</p>
                        </div>
                        <button
                            onClick={() => navigate("/products/create")}
                            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full">
                            <FaPlus /> Thêm mới sản phẩm
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 mt-4">
                        {/* <h2 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h2> */}

                        {/* Header */}
                        <div className="grid grid-cols-7 gap-4 font-semibold text-gray-600 border-b pb-2">
                            <div>Tên sản phẩm</div>
                            <div>Danh mục</div>
                            <div>Size</div>
                            <div>Giá</div>
                            <div>Số lượng còn</div>
                            <div>Trạng thái</div>
                            <div>Hành động</div>
                        </div>

                        {/* Body */}
                        {dataProducts?.products?.map((product) => (
                            <div
                                key={product._id}
                                className="grid grid-cols-7 gap-4 py-3 border-b items-start"
                            >
                                {/* Tên */}
                                <div>{product.name}</div>

                                {/* Category */}
                                <div>{product.categoryId.name}</div>

                                {/* Size (nhiều dòng) */}
                                <div className="flex flex-col gap-1">
                                    {product.variants.map((v, i) => (
                                        <span key={i} className="text-blue-600 font-medium">
                                            {v.size}
                                        </span>
                                    ))}
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-1">
                                    {product.variants.map((v, i) => (
                                        <span key={i} className="text-green-600 font-semibold">
                                            {v.price.toLocaleString()}đ
                                        </span>
                                    ))}
                                </div>

                                {/* Stock */}
                                <div className="flex flex-col gap-1">
                                    {product.variants.map((v, i) => (
                                        <span key={i}>{v.stock}</span>
                                    ))}
                                </div>

                                {/* Status */}
                                <div className="flex flex-col gap-1">
                                    {product.variants.map((v, i) => {
                                        const status = getStatus(v.stock, product.isActive);
                                        return (
                                            <span
                                                key={i}
                                                className={`w-1/2 px-2 py-1 rounded-full text-xs ${status.color}`}
                                            >
                                                {status.text}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 items-between">
                                    <button
                                        onClick={() => navigate(`/products/update/${product._id}`)}
                                        className="text-blue-500"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product); // product đang hiển thị
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-500">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-96 shadow-lg text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 w-12 h-12 flex items-center justify-center rounded-full mx-auto">
                                <FaTrash className="text-red-500 w-6 h-6" />
                            </div>
                        </div>
                        <h2 className="text-lg font-semibold mb-2">Xác nhận xóa sản phẩm?</h2>
                        <p className="text-gray-500 mb-6">
                            Bạn có chắc chắn muốn xóa '{selectedProduct.name}' không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-between gap-4">
                            <button
                                className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteProduct(selectedProduct._id)}
                            >
                                Xóa ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
