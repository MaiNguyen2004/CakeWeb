import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { FaCoins, FaExclamationTriangle, FaShoppingBag, FaEdit, FaPlus, FaTrash } from "react-icons/fa";

import { getProductsBySellerAPI, deleteProductByIdAPI } from '../../services/product.service'
import { pendingOrdersCountBySeller } from '../../services/order.service'
import Pagination from "../../components/common/Pagination";
import Sidebar from '../../components/layout/Sidebar'
import HeaderDashboard from '../../components/layout/HeaderDashboard'
import { toast } from "react-toastify";

const StatCard = ({ title, value, icon: Icon, textColor }) => (
    <div className="bg-white p-3 rounded-xl shadow-sm w-full">
        <Icon size={24} className={`${textColor} mb-2`} />
        <div className={`flex justify-between items-center ${textColor} font-bold`}>
            <h4>{title}</h4>
            <h4>{value}</h4>
        </div>
    </div>
);

export default function Dashboard() {
    const navigate = useNavigate()
    const [dataProducts, setDataProducts] = useState(0);
    const [totalOrderPendingStatus, setTotalOrderPendingStatus] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const data = await getProductsBySellerAPI(user.id, currentPage, itemsPerPage);
            setDataProducts(data)
            setTotalPages(data.totalPages)
            const dataTotal = await pendingOrdersCountBySeller(user.id)
            setTotalOrderPendingStatus(dataTotal.total)
        };

        fetchData();
    }, [currentPage]);

    console.log(totalPages);


    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [dataProducts]);
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
                <div className="bg-gray-50 p-4 max-h-screen">
                    {/* Top Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-2">
                        <StatCard
                            icon={FaCoins}
                            textColor="text-blue-800"
                            title="Tổng doanh thu"
                            value={dataProducts.totalRevenue} />
                        <StatCard
                            icon={FaShoppingBag}
                            textColor="text-purple-800"
                            title="Đơn hàng mới"
                            value={totalOrderPendingStatus} />

                        <StatCard
                            icon={FaExclamationTriangle}
                            textColor="text-red-800"
                            title="Sản phẩm sắp hết"
                            value="05 bánh" />

                    </div>
                    <div className="flex justify-between items-center mb-2 bg-white rounded-xl shadow-sm p-4">
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
                    {/* Product Table */}

                    <div className="bg-white rounded-xl shadow p-4 flex flex-col h-[660px]">

                        {/* Header */}
                        <div className="grid grid-cols-7 gap-4 font-semibold text-gray-800 border-b pb-2">
                            <div>Tên sản phẩm</div>
                            <div>Danh mục</div>
                            <div>Size</div>
                            <div>Giá</div>
                            <div>Số lượng còn</div>
                            <div>Trạng thái</div>
                            <div>Hành động</div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {dataProducts?.products?.map((product) => {
                                // 👉 Lấy variant có giá nhỏ nhất
                                const minVariant = product.variants.reduce((min, curr) =>
                                    curr.price < min.price ? curr : min,
                                    product.variants[0]
                                );

                                const status = getStatus(minVariant.stock, product.isActive);

                                return (
                                    <div
                                        key={product._id}
                                        className="grid grid-cols-7 gap-4 py-3 border-b items-start"
                                    >
                                        {/* Tên */}
                                        <div>{product.name}</div>

                                        {/* Category */}
                                        <div>{product.categoryId.name}</div>

                                        {/* Size */}
                                        <div>
                                            <span className="text-blue-600 font-medium">
                                                {minVariant.size}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <span className="text-green-600 font-semibold">
                                                {minVariant.price.toLocaleString()}đ
                                            </span>
                                        </div>

                                        {/* Stock */}
                                        <div>
                                            <span>{minVariant.stock}</span>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                                                {status.text}
                                            </span>
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
                                                    setSelectedProduct(product);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-500"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="mt-auto pt-4">
                            <Pagination
                                totalItems={dataProducts?.total || 0}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                            />
                        </div>

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
