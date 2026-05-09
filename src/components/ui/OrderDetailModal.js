import {
    FaTimes,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaWallet,
    FaHeadset,
} from "react-icons/fa";
import { formatOrderCode, formatPrice } from "../../utils/calcul";
import mapBackendStatus from "../../utils/mapBackendStatus";

const safeDate = (date) => {
    if (!date) return "Chưa có";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "Không hợp lệ";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
};

const OrderDetailModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;
    const statusUi = mapBackendStatus(order?.status);

    const products = Array.isArray(order?.products) && order.products.length > 0
        ? order.products.map((p) => ({
            name: p?.name || p?.productId?.name || "Sản phẩm",
            note: `${p?.size || "N/A"} · SL: ${String(p?.quantity || 1).padStart(2, "0")}`,
            price: Number(p?.price || 0) * Number(p?.quantity || 1),
            image: p?.img || p?.image || p?.productId?.images?.[0] || order?.image,
            tag: p?.category || "THE ETHEREAL",
        }))
        : [];


    const subtotal = products.reduce((sum, p) => sum + Number(p.price || 0), 0);
    const shippingFee = 35000;
    const voucher = 0;
    const total = Math.max(0, subtotal + shippingFee - voucher);

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-6xl rounded-[26px] bg-white p-6 shadow-2xl md:p-8">
                <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                    <h2 className="text-3xl font-black text-slate-900">Chi tiết đơn hàng</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
                    <div>
                        <div className="rounded-3xl bg-slate-50 p-6">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Chi tiết xác nhận</p>
                            <p className="mt-2 text-3xl font-black text-slate-900">#{formatOrderCode(order?.orderId)}</p>
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700">
                                    <FaCalendarAlt className="text-slate-500" />
                                    {safeDate(order?.orderedDate)}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${statusUi.color}`}
                                >
                                    <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-current opacity-80" />
                                    {statusUi.label}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="mb-4 text-3xl font-black text-slate-900">Danh sách sản phẩm ({products.length.toString().padStart(2, "0")})</h3>
                            <div className="space-y-4">
                                {products.map((item, idx) => (
                                    <div key={`${item.name}-${idx}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                                        <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <span className="rounded-md bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700">
                                                {item.tag}
                                            </span>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">{item.name}</p>
                                            <p className="text-sm text-slate-500">{item.note}</p>
                                        </div>
                                        <p className="text-3xl font-extrabold text-sky-700">{formatPrice(item.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="flex items-center gap-2 text-xl font-bold text-slate-800">
                                <FaMapMarkerAlt className="text-sky-700" />
                                Thông tin giao hàng
                            </p>
                            <p className="mt-4 text-xs font-semibold uppercase text-slate-400">Người nhận</p>
                            <p className="text-lg font-bold text-slate-900">
                                {order?.receiver?.receiverName || "Chưa có"} · {order?.receiver?.phone || "Chưa có"}
                            </p>
                            <p className="mt-3 text-xs font-semibold uppercase text-slate-400">Địa chỉ</p>
                            <p className="text-slate-700">
                                {order?.receiver?.receiverAddress || "Chưa có"}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 p-5">
                            <p className="flex items-center gap-2 text-xl font-bold text-slate-800">
                                <FaWallet className="text-sky-700" />
                                Thanh toán
                            </p>
                            <div className="mt-4 rounded-xl bg-white p-3 text-slate-700 ring-1 ring-slate-200">
                                {(order?.paymentMethod || "COD").toUpperCase()} · Apple Pay
                            </div>
                        </div>

                        <div className="rounded-3xl bg-[#0867A8] p-6 text-white shadow-xl">
                            <p className="text-2xl font-black">Tổng kết chi phí</p>
                            <div className="mt-4 space-y-2 text-sm text-sky-100">
                                <div className="flex justify-between">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển</span>
                                    <span>{formatPrice(shippingFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Voucher</span>
                                    <span>- {formatPrice(voucher)}</span>
                                </div>
                            </div>
                            <div className="my-4 h-px bg-white/30" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase text-sky-200">Tổng cộng</p>
                                    <p className="text-3xl font-black">{formatPrice(total)}</p>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-900 hover:bg-sky-300"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <FaHeadset />
                                        Hỗ trợ
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
