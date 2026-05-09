import api from "./api";

export const createOrder = async ({ items, paymentMethod, deliveryMethod, requestedDeliveryTime, receiverAddress }) => {
    const res = await api.post("/orders", { items, paymentMethod, deliveryMethod, requestedDeliveryTime, receiverAddress });
    return res.data;
};

// GET /orders/seller/pending/count (sellerId lấy từ token)
export const pendingOrdersCountBySeller = async () => {
    try {
        const res = await api.get(`/orders/seller/pending/count`);
        return res.data;
    } catch (error) {
        console.error("Error count order in pending status:", error);
        throw error;
    }
};

export const getOrderHistoryAPI = async (page = 1, limit = 5) => {
    try {
        const res = await api.get(`/orders/orderHistory?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        console.error("Error get order history:", error);
        throw error;
    }
};


export const orderDetailAPI = async (orderId) => {
    try {
        const res = await api.get(`/orders/${orderId}/orderDetail`);
        return res.data;
    } catch (error) {
        console.error("Error order detail:", error);
        throw error;
    }
};