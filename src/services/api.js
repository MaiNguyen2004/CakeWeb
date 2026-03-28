import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9999", // backend của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để tự động gửi token nếu có
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default api;