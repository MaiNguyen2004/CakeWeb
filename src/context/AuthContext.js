import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitalized] = useState(false);

    useEffect(() => {
        const hydrateUser = async () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsInitalized(true);
                return;
            }

            try {
                const res = await api.get("/me");
                const latestUser = res.data;
                setUser(latestUser);
                localStorage.setItem("user", JSON.stringify(latestUser));
            } catch (error) {
                // token cũ/invalid -> clear session để tránh state lệch
                setUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            } finally {
                setIsInitalized(true);
            }
        };

        hydrateUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const isAuthenticated = !!user;
    const isSeller = user?.role === "seller" || user?.roleId?.name === "seller";

    return (
        <AuthContext.Provider value={{
            user, setUser, login, logout, isAuthenticated,
            isSeller, isInitialized
        }}>
            {children}
        </AuthContext.Provider>
    );
};
