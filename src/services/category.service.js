import api from "./api";

// GET /products
export const getCategoriesAPI = async () => {
    try {
        const res = await api.get("/categories/categoryName");
        return res.data;
    } catch (error) {
        console.error("Error getCategory:", error);
        throw error;
    }
};