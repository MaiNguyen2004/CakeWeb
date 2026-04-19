import { FaBox, FaUsers, FaShoppingCart, FaHistory, FaCog, FaHeart } from "react-icons/fa";
import { NavLink, Link } from 'react-router-dom'
import logo from '../../assets/images/logo.jpg';
import { useAuth } from '../../context/AuthContext'

// Sidebar Component
const Sidebar = () => {
    const { user } = useAuth()
    // console.log("user:", user);

    const menu = [
        { name: "Thông tin cá nhân", icon: <FaUsers />, navigate: "/profile" },
        { name: "Đặt hàng", icon: <FaShoppingCart />, navigate: "/orders" },
        { name: "Lịch sử đặt hàng", icon: <FaHistory />, navigate: "/historyOrder" },
        { name: "Sản phẩm yêu thích", icon: <FaHeart />, navigate: "/productFavorite" },
        { name: "Cài đặt", icon: <FaCog />, navigate: "/settings" },
    ];

    return (
        <div className="w-64 bg-[#F8FAFC] h-screen p-2 flex flex-col justify-between sticky top-0 z-50">
            <div>
                <Link to="/">
                    <img src={logo} alt="logo"
                        className="w-20 h-20 object-contain rounded-full justify-between mx-auto cursor-pointer" />

                </Link>
                <ul className="space-y-3 mt-6">
                    {menu.map((item, index) => (
                        <NavLink to={item.navigate} key={index}>
                            {({ isActive }) => (
                                <div
                                    className={`flex items-center gap-3 p-2 my-2 rounded-lg transition
                    ${isActive
                                            ? "bg-blue-100 text-blue-600 font-semibold"
                                            : "text-gray-600 hover:bg-gray-200"}`}
                                >
                                    <span className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </ul>
            </div>

            <div className="mt-auto m-4 p-3 bg-white rounded-xl shadow flex items-center gap-3">

                {/* Avatar */}
                <img
                    src={user?.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border"
                />

                {/* Info */}
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">
                        {user?.nickName}
                    </span>
                    <span className="text-xs text-gray-500">
                        {user?.role === "seller" ? "Chủ cửa hàng"
                            : user?.role === "Admin" ? "Adminstrator"
                                : user?.role === "shipper" ? "Người vận chuyển" : "Người dùng"}
                    </span>
                </div>
            </div>
        </div>
    );
};// Card Component

export default Sidebar