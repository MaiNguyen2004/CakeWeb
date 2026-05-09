import {
    COLORS,
    DEFAULT_COLOR,
} from "../constants/orderStatusColors";

const STATUS_LABELS = {
    Pending: "Chờ xác nhận",
    Processing: "Đang xử lý",
    Shipped: "Đang giao",
    Completed: "Đã hoàn thành",
    Cancelled: "Đã hủy",
};

const mapBackendStatus = (status) => {
    const key = (status ?? "").toString().trim();
    return {
        label: STATUS_LABELS[key] || key || "—",
        color: COLORS[key] || DEFAULT_COLOR,
    };
};

export default mapBackendStatus;
