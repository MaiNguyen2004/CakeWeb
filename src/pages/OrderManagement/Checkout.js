import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Input from "../../components/common/InputForm";
import DateInputForm from "../../components/common/DateInputForm";
import TextareaForm from "../../components/common/TextareaForm";
import OrderSuccessModal from "../../components/ui/OrderSuccessModal";
import { createOrder } from "../../services/order.service";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaStore, FaMoneyBillWave, FaUniversity, FaWallet, FaUserCircle, FaShippingFast, FaCreditCard, FaReceipt, FaPhoneAlt, FaCalendarAlt, FaTicketAlt, FaUser } from "react-icons/fa";
import { formatOrderCode, formatEstimatedDelivery } from "../../utils/calcul";
const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const product = location.state?.product;

    const variants = useMemo(
        () => (Array.isArray(product?.variants) ? product.variants : []),
        [product]
    );

    const [form, setForm] = useState({
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        deliveryMethod: "Home Delivery",
        paymentMethod: "COD",
        deliveryTime: "",
        size: variants[0]?.size || "",
        quantity: 1,
    });
    const [submitting, setSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successOrder, setSuccessOrder] = useState(null);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            receiverName: user?.fullName || user?.nickName || "",
            receiverPhone: user?.phone || "",
            receiverAddress: user?.address || "",
        }));
    }, [user]);

    const selectedVariant = variants.find((v) => v.size === form.size);
    const unitPrice = Number(selectedVariant?.price || 0);
    const total = unitPrice * Number(form.quantity || 0);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="mx-auto max-w-4xl px-6 py-10">
                    <div className="rounded-xl bg-white p-8 shadow-sm text-center">
                        <p className="text-gray-600">Không có sản phẩm để đặt ngay.</p>
                        <button
                            className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-white"
                            onClick={() => navigate("/shop")}
                        >
                            Quay về cửa hàng
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleSubmit = async () => {
        if (!form.receiverName || !form.receiverPhone || !form.receiverAddress) {
            toast.error("Vui lòng nhập đầy đủ thông tin người nhận.");
            return;
        }
        if (!form.size) {
            toast.error("Vui lòng chọn size.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await createOrder({
                items: [{
                    productId: product.id || product._id,
                    size: form.size,
                    quantity: Number(form.quantity),

                }],
                paymentMethod: form.paymentMethod,
                deliveryMethod: form.deliveryMethod,
                receiverAddress: form.receiverAddress,
                requestedDeliveryTime: form.deliveryTime || undefined,
            });

            if (response?.updatedUser?.address) {
                const nextUser = { ...user, address: response.updatedUser.address };
                setUser(nextUser);
                localStorage.setItem("user", JSON.stringify(nextUser));
            }
            const orderPayload = response?.order;
            setSuccessOrder({
                message: response?.message || "Đặt hàng thành công",
                order: {
                    ...orderPayload,
                    orderCode: formatOrderCode(orderPayload?.orderId),
                    estimatedDelivery: formatEstimatedDelivery(orderPayload?.requestedDeliveryTime),
                    products: Array.isArray(orderPayload?.products) && orderPayload?.products.length > 0
                        ? orderPayload.products
                        : [{
                            productName: product?.name || "",
                            image: Array.isArray(product?.img) ? product.img[0] : product?.img,
                            quantity: Number(form.quantity || 1),
                        }],
                },
                receiver: response?.receiver || {
                    nickName: form.receiverName,
                    address: form.receiverAddress,
                    phone: form.receiverPhone,
                },
            });
            setIsSuccessModalOpen(true);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Đặt hàng thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <section className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <FaUserCircle className="text-blue-600" />
                            <span>Thông tin người nhận</span>
                        </h2>
                        <div className="mt-5 space-y-4">
                            <h5 className="font-semibold text-gray-900 mb-4">Họ và tên khách hàng</h5>
                            <Input
                                placeholder="Họ và tên"
                                value={form.receiverName}
                                onChange={(e) => setForm((p) => ({ ...p, receiverName: e.target.value }))}
                                icon={FaUser}
                                iconPosition="left"
                            />
                            {/* </div> */}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-4">Số điện thoại</h5>
                                    <Input
                                        placeholder="Số điện thoại"
                                        value={form.receiverPhone}
                                        onChange={(e) => setForm((p) => ({ ...p, receiverPhone: e.target.value }))}
                                        icon={FaPhoneAlt}
                                        iconPosition="left"
                                    />

                                </div>
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-4">Thời gian nhận bánh</h5>
                                    <DateInputForm
                                        value={form.deliveryTime}
                                        onChange={(e) => setForm((p) => ({ ...p, deliveryTime: e.target.value }))}
                                        icon={FaCalendarAlt}
                                        iconPosition="left"
                                    />

                                </div>
                            </div>
                            <h5 className="font-semibold text-gray-900 mb-4">Địa chỉ chi tiết</h5>
                            <TextareaForm
                                rows={3}
                                placeholder="Địa chỉ nhận hàng"
                                value={form.receiverAddress}
                                onChange={(e) => setForm((p) => ({ ...p, receiverAddress: e.target.value }))}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <FaCreditCard className="text-blue-600" />
                            <span>Phương thức thanh toán</span>
                        </h3>
                        <div className="mt-5 space-y-3">
                            <label
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${form.paymentMethod === "COD"
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={form.paymentMethod === "COD"}
                                    onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
                                    className="h-4 w-4 accent-blue-600"
                                />
                                <FaMoneyBillWave className="text-blue-600" />
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${form.paymentMethod === "Bank Transfer"
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Bank Transfer"
                                    checked={form.paymentMethod === "Bank Transfer"}
                                    onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
                                    className="h-4 w-4 accent-blue-600"
                                />
                                <FaUniversity className="text-blue-600" />
                                <span>Chuyển khoản ngân hàng</span>
                            </label>
                            <label
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${form.paymentMethod === "PayPal"
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={form.paymentMethod === "PayPal"}
                                    onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))}
                                    className="h-4 w-4 accent-blue-600"
                                />
                                <FaWallet className="text-blue-600" />
                                <span>Ví điện tử (Momo, ZaloPay)</span>
                            </label>
                        </div>
                    </section>
                </div>

                <aside className="rounded-2xl space-y-6">
                    <section className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                            <FaShippingFast className="text-blue-600" />
                            <span>Hình thức nhận hàng</span>
                        </h3>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setForm((p) => ({ ...p, deliveryMethod: "Home Delivery" }))}
                                className={`rounded-xl border p-4 text-left transition ${form.deliveryMethod === "Home Delivery"
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaHome className="text-blue-600" />
                                    <p className="font-semibold text-gray-900">Giao tận nơi</p>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Phí vận chuyển theo km</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm((p) => ({ ...p, deliveryMethod: "Store Pickup" }))}
                                className={`rounded-xl border p-4 text-left transition ${form.deliveryMethod === "Store Pickup"
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaStore className="text-blue-600" />
                                    <p className="font-semibold text-gray-900">Nhận tại tiệm</p>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Miễn phí 100% phí dịch vụ</p>
                            </button>
                        </div>
                    </section>

                    <section className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                            <FaReceipt className="text-blue-600" />
                            <span>Tóm tắt đơn hàng</span>
                        </h3>
                        <div className="mt-4 border-t pt-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={Array.isArray(product.img) ? product.img[0] : product.img}
                                    alt={product.name}
                                    className="h-16 w-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-500">Số lượng: {form.quantity}</p>
                                </div>
                                <p className="font-semibold text-blue-700">
                                    {total.toLocaleString("vi-VN")}đ
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                            <Input
                                className="mb-0"
                                placeholder="Nhập mã giảm giá"
                                icon={FaTicketAlt}
                                iconPosition="left"
                            />
                            <button
                                type="button"
                                className="rounded-lg bg-blue-200 px-2 py-2 text-sm font-medium text-blue-800"
                            >
                                Áp dụng
                            </button>
                        </div>

                        <div className="mt-5 border-t pt-4 text-sm text-gray-600 space-y-3">
                            <div className="flex justify-between">
                                <span>Tạm tính</span>
                                <span>{total.toLocaleString("vi-VN")}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí giao hàng</span>
                                <span>{(35000).toLocaleString("vi-VN")}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá</span>
                                <span>- 0đ</span>
                            </div>
                            <div className="flex justify-between pt-2 text-2xl font-bold text-blue-700">
                                <span>Tổng cộng</span>
                                <span>{(total + 35000).toLocaleString("vi-VN")}đ</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={handleSubmit}
                            className="mt-6 w-full rounded-full bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                        >
                            {submitting ? "Đang xử lý..." : "Xác nhận đặt bánh"}
                        </button>
                    </section>
                </aside>
            </main>
            <Footer />
            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                orderInfo={successOrder}
                onTrackOrder={() => navigate("/profile")}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    navigate("/shop");
                }}
            />
        </div>
    );
};

export default Checkout;
