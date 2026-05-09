import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

/**
 * orderInfo gồm cả thông tin order và người nhận:
 * {
 *   message: string,
 *   order: { orderCode, estimatedDelivery, products: [...] },
 *   receiver: { nickName, address, phone? }
 * }
 */
const OrderSuccessModal = ({
    isOpen,
    onClose,
    onTrackOrder,
    orderInfo,
}) => {
    if (!isOpen) return null;

    const apiProducts = Array.isArray(orderInfo?.order?.products) ? orderInfo.order.products : [];

    const previewProducts = (apiProducts.length > 0
        ? apiProducts.map((item) => {
            const rawImage = item?.image ?? item?.images?.[0];
            const image = Array.isArray(rawImage) ? rawImage[0] : rawImage;
            const quantity = Number(item?.quantity || 0);
            const baseName = item?.productName || item?.name || "";
            const name = quantity > 1 ? `${baseName} x ${quantity}` : baseName;

            return { name, image };
        })
        : []
    ).filter((item) => item?.name || item?.image);

    const message = orderInfo?.message || "Đặt hàng thành công";
    const orderCode = orderInfo?.order?.orderCode || "";
    const estimatedDelivery = orderInfo?.order?.estimatedDelivery || "";
    const receiverName = orderInfo?.receiver?.nickName || "";
    const receiverAddress = orderInfo?.receiver?.address || "";
    const totalProduct = orderInfo?.order.totalProduct
    const totalPrice = orderInfo?.order.totalPrice
    const extraCount = Math.max(0, previewProducts.length - 2);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
            <div className="w-[1000px] max-w-full overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
                <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="relative mx-auto w-[320px] pt-32">
                        {previewProducts.length > 1 ? (
                            <div className="relative h-[360px]">
                                <div className="absolute left-0 top-7 z-20 w-[215px] origin-bottom-left rotate-[-8deg] overflow-hidden rounded-[24px] shadow-xl">
                                    <img
                                        src={previewProducts[0]?.image}
                                        alt={previewProducts[0]?.name || "product-1"}
                                        className="h-[300px] w-full object-cover"
                                    />
                                </div>
                                <div className="absolute left-[110px] top-0 z-10 w-[210px] origin-bottom-right rotate-[8deg] overflow-hidden rounded-[24px] shadow-xl">
                                    <img
                                        src={previewProducts[1]?.image}
                                        alt={previewProducts[1]?.name || "product-2"}
                                        className="h-[290px] w-full object-cover"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="origin-bottom-left rotate-[-6deg] overflow-hidden rounded-[28px] shadow-xl">
                                <img
                                    src={previewProducts[0]?.image || ""}
                                    alt={previewProducts[0]?.name || "product"}
                                    className="h-[340px] w-full object-cover"
                                />
                            </div>
                        )}
                        <div className="absolute -bottom-[-110px] -right-2 flex w-[220px] items-center gap-3 rounded-2xl bg-white p-3 shadow-xl">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <FaCheckCircle size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Đang chuẩn bị</p>
                                <p className="text-xs text-slate-500">Bếp đang hoạt động</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                            {message}
                        </p>
                        <h2 className="mt-4 text-5xl font-black leading-tight text-slate-900">
                            Ngọt ngào đang <span className="text-blue-700">trên đường tới.</span>
                        </h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Cảm ơn bạn đã tin tưởng The Ethereal Patisserie. Đơn hàng của bạn đã được tiếp nhận và đang
                            được những nghệ nhân làm bánh chăm chút.
                        </p>

                        <div className="mt-8 rounded-3xl bg-[#8CE882]/90 p-5 shadow-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold uppercase text-slate-600">Mã đơn hàng</p>
                                <p className="mt-1 text-sm font-black text-slate-900">{orderCode}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold uppercase text-slate-600">Giao hàng dự kiến</p>
                                <p className="mt-1 text-sm font-black text-slate-900">{estimatedDelivery}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold uppercase text-slate-600">Người nhận</p>
                                <p className="mt-1 text-sm font-black text-slate-900">{receiverName}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold uppercase text-slate-600">Địa chỉ nhận</p>
                                <p className="mt-1 text-sm font-black text-slate-900">{receiverAddress}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-xs font-semibold uppercase text-slate-600">{totalProduct} sản phẩm</p>
                                <p className="mt-1 text-sm font-black text-slate-900">{totalPrice}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                type="button"
                                onClick={onTrackOrder}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-600"
                            >
                                Theo dõi đơn hàng
                                <FaArrowRight size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
