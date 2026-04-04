import api from "./api";

// GET /products
export const getProductsAPI = async () => {
    try {
        const res = await api.get("/products");
        return res.data;
    } catch (error) {
        console.error("Error getProducts:", error);
        throw error;
    }
};

export const getProductsBySellerAPI = async (sellerId) => {
    try {
        const res = await api.get(`/products/seller/${sellerId}`, sellerId);
        return res.data;
    } catch (error) {
        console.error("Error getProduct by sellerId :", error);
        throw error;
    }
};

export const getProductsSortAPI = async (options) => {
    try {
        const res = await api.get(`/products/productSortby?sort=${options}`);
        return res.data;
    } catch (error) {
        console.error("Error getProductSort by options :", error);
        throw error;
    }
};

export const bestSellingProductsTop6 = async (options) => {
    try {
        const res = await api.get(`/products/bestSellingProductsTop6`);
        return res.data;
    } catch (error) {
        console.error("Error getProduct bestSellingProductsTop6 :", error);
        throw error;
    }
};

export const addNewProduct = async (data) => {
    try {
        const res = await api.post(`/products/newProduct`, data);
        return res.data;
    } catch (error) {
        console.error("Error add new Product :", error);
        throw error;
    }
};

export const getProductByIdAPI = async (productId) => {
    try {
        const res = await api.get(`/products/getProduct/${productId}`);
        return res.data;
    } catch (error) {
        console.error("Error get Product :", error);
        throw error;
    }
};

export const updateProductByIdAPI = async (productId, data) => {
    try {
        const res = await api.put(`/products/updateProduct/${productId}`, data);
        return res.data;
    } catch (error) {
        console.error("Error update Product :", error);
        throw error;
    }
};

export const deleteProductByIdAPI = async (productId) => {
    try {
        const res = await api.delete(`/products/deleteProduct/${productId}`);
        return res.data;
    } catch (error) {
        console.error("Error delete Product :", error);
        throw error;
    }
};