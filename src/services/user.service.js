import api from "./api";


export const getAllUsers = async () => {
    const res = await api.get("/getUsers");
    return res.data;
};

export const register = async (data) => {
    const res = await api.post("/register", data)
    return res.data;

}

export const login = async (data) => {
    const res = await api.post("/login", data)
    return res.data;

}

export const bestSellerTop10 = async () => {
    const res = await api.get("/bestSellerTop10")
    return res.data;

}


