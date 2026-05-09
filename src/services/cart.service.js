import api from "./api";


export const getCartByUser = async (userId) => {
    const res = await api.get(`/carts/${userId}`);
    return res.data?.items ?? [];
};
export const addCartItem = async ({ data }) => {
    const res = await api.post(`/carts/add`, data);
    return res.data;
}
export const removeCartItem = async ({ productId }) => {
    const res = await api.delete(`/carts/remove`, { data: { productId } });
    return res.data;
};

export const updateCartItemQuantity = async ({ productId, size, quantity }) => {
    const res = await api.patch(`/carts/updateCard`, { productId, size, quantity });
    return res.data;
};
