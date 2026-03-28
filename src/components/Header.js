import { NavLink } from "react-router-dom";
import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaSignOutAlt, FaKey } from 'react-icons/fa';
import Login from "../pages/Login";
const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])
    const isAuthenticated = user ? true : false
    const isSeller = user?.role === "seller" || user?.roleId?.name === "seller"

    const handleLogOut = () => {
        localStorage.removeItem('user')
        setUser(null)
        navigate('/')
        window.location.reload()
    }
    return (
        <header className="w-full flex items-center justify-between px-10 py-4 shadow-sm bg-white">

            {/* Logo */}
            <h1 className="text-xl font-semibold text-blue-600">Cake</h1>

            {/* Menu */}
            <nav className="flex gap-8 text-gray-600 font-medium">

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                            : "hover:text-blue-600"
                    }
                >
                    Trang chủ
                </NavLink>

                <NavLink
                    to="/shop"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                            : "hover:text-blue-600"
                    }
                >
                    Sản phẩm
                </NavLink>

                <NavLink
                    to="/story"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                            : "hover:text-blue-600"
                    }
                >
                    Câu chuyện
                </NavLink>

                <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                            : "hover:text-blue-600"
                    }
                >
                    Liên hệ
                </NavLink>

            </nav>

            {/* Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
                Đặt ngay
            </button>
            <div className="relative">
                {isAuthenticated ? (
                    <>
                        {/* Avatar button */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center justify-center rounded-full font-bold"
                            style={{
                                height: "60px",
                                width: "60px",
                                border: "3px solid #FBE0D1",
                                backgroundColor: "#FBE0D1",
                                fontSize: "15px",
                                color: "#EA7460",
                            }}
                        >
                            {user?.nickName}
                        </button>

                        {/* Dropdown */}
                        {open && (
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50"
                                style={{
                                    transform: "translateX(-70px)",
                                    border: "3px solid #fff",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                                >
                                    <FaUser className="mr-2" /> Profile
                                </button>

                                <button
                                    onClick={handleLogOut}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                                >
                                    <FaSignOutAlt className="mr-2" /> Logout
                                </button>

                                <button
                                    onClick={() => navigate("/change-password")}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                                >
                                    <FaKey className="mr-2" /> Change Password
                                </button>
                                {isSeller && (
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                                    >
                                        📦 Quản lý sản phẩm
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center gap-2">

                        {/* Login */}
                        <button
                            // onClick={() => navigate("/login")}
                            onClick={() => setIsOpenModal(true)}
                            className="mr-2"
                            style={{
                                width: "120px",
                                height: "40px",
                                borderRadius: "16px",
                                color: "#EA7460",
                                backgroundColor: "#FBE0D1",
                                borderColor: "#FBE0D1",
                            }}
                        >
                            LOGIN
                        </button>
                    </div>
                )}
            </div>
            {isOpenModal && (
                <Login onClose={() => setIsOpenModal(false)} />
            )}
        </header>
    );
};

export default Header;