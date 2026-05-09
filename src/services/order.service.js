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