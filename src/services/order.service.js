import api from "./api";

// GET /products
export const pendingOrdersCountBySeller = async (sellerId) => {
    try {
        const res = await api.get(`/orders/seler/${sellerId}/pending/count`);
        return res.data;
    } catch (error) {
        console.error("Error count order in pending status:", error);
        throw error;
    }
};