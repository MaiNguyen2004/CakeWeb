export const formatDateVN = (date) => {
    if (!date) return "Chưa có";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "Không hợp lệ";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day} tháng ${month}, ${year}`;
};


export const formatPrice = (value) => `${value.toLocaleString("vi-VN")}đ`;


export const formatOrderCode = (id) => {
    const suffix = (id || "").toString().slice(-3).toUpperCase();
    return `#CAKE-${new Date().getFullYear()}-${suffix || "000"}`;
};

export const formatEstimatedDelivery = (requestedDeliveryTime) => {
    const base = requestedDeliveryTime ? new Date(requestedDeliveryTime) : new Date(Date.now() + 60 * 60 * 1000);
    return base.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        hour12: false,
    });
};