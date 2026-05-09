import Sidebar from "../../components/layout/SidebarUser";
import Header from '../../components/layout/HeaderDashboard'
import { FaChevronLeft, FaChevronRight, FaClock, FaTruck, FaCrown, FaEye } from "react-icons/fa";
import StatCard from '../../components/ui/StatCard'
import { useState, useEffect } from "react";
import { getOrderHistoryAPI, orderDetailAPI } from '../../services/order.service'
import { formatOrderCode, formatEstimatedDelivery, formatPrice } from '../../utils/calcul'
import OrderDetailModal from "../../components/ui/OrderDetailModal";
import { toast } from "react-toastify";
import mapBackendStatus from "../../utils/mapBackendStatus";


const OrderHistory = () => {
    const [dataOrder, setDataOrder] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [totalOrderByStatus, setTotalOrderByStatus] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOrderHistoryAPI(currentPage, itemsPerPage);
                setDataOrder(Array.isArray(data?.orders) ? data.orders : []);
                setTotalPages(Number(data?.totalPages) > 0 ? data.totalPages : 1);
                setTotalOrderByStatus(data?.totalOrderStatus)
            } catch {
                setDataOrder([]);
            }
        };

        fetchData();
    }, [currentPage]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
    const handleViewDetail = async (orderId) => {
        try {
            const detail = await orderDetailAPI(orderId);
            setSelectedOrder(detail);
            setIsDetailModalOpen(true);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Không tải được chi tiết đơn hàng.");
        }
    };
    return (
        <div className="flex">
            <Sidebar />
            <div className='flex-1 bg-gray-100'>
                <Header title='Lịch sử đơn hàng' />
                <div className="px-20 py-10  gap-8">
                    <div className="grid grid-cols-6 gap-4 mb-2">
                        <StatCard
                            icon={FaClock}
                            textColor="text-black-800"
                            title="Tổng đơn hàng"
                            value='24' />
                        <StatCard
                            icon={FaTruck}
                            textColor="text-amber-800"
                            title="Chờ xác nhận"
                            value={totalOrderByStatus.pendingOrder} />
                        <StatCard
                            icon={FaTruck}
                            textColor="text-sky-800"
                            title="Đang xử lý"
                            value={totalOrderByStatus.processingOrder} />
                        <StatCard
                            icon={FaTruck}
                            textColor="text-green-600"
                            title="Đang giao"
                            value={totalOrderByStatus.shippingOrder} />
                        <StatCard
                            icon={FaTruck}
                            textColor="text-emerald-400"
                            title="Đã hoàn thành"
                            value={totalOrderByStatus.completedOrder} />
                        <StatCard
                            icon={FaTruck}
                            textColor="text-rose-700"
                            title="Đã hủy"
                            value={totalOrderByStatus.cancelOrder} />


                    </div>
                    <div className="flex justify-between items-center mb-2 bg-white rounded-xl shadow-sm p-4">
                        <div>
                            <h2 className="font-bold text-xl">Danh sách đơn hàng</h2>
                            <p className="text-gray-500">Theo dõi và quản lý những khoảnh khắc ngọt ngào bạn đã đặt tại The Ethereal Patisserie.</p>
                        </div>
                    </div>
                    <section className="space-y-5">
                        {dataOrder.map((order) => {
                            const statusUi = mapBackendStatus(order.status);
                            return (
                                <article key={order.orderId} className="rounded-3xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                        <img src={order.image} alt="" className="h-32 w-32 rounded-xl object-cover md:h-24 md:w-24" />

                                        <div className="min-w-[250px]">
                                            <p className="text-xs uppercase tracking-wide text-slate-400">Mã đơn hàng</p>
                                            <p className="text-lg font-black text-slate-800">#{formatOrderCode(order.orderId)}</p>
                                        </div>

                                        <div className="min-w-[200px]">
                                            <p className="text-xs text-slate-400">Ngày đặt</p>
                                            <p className="text-lg font-semibold text-slate-800">{formatEstimatedDelivery(order.orderedDate)}</p>
                                        </div>

                                        <div className="min-w-[200px]">
                                            <p className="text-xs text-slate-400">Tổng tiền</p>
                                            <p className="text-lg font-semibold text-slate-800">{formatPrice(order.totalPrice)}</p>
                                        </div>

                                        <div className="min-w-[200px]">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusUi.color}`}
                                            >
                                                <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-current opacity-80" />
                                                {statusUi.label}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleViewDetail(order.orderId)}
                                            className="ml-auto inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 md:ml-0"
                                        >
                                            <FaEye />
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                </div>
            </div>
            <OrderDetailModal
                isOpen={isDetailModalOpen}
                order={selectedOrder}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedOrder(null);
                }}
            />
        </div>
    );
};

export default OrderHistory;
