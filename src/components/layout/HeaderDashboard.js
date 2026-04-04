import { FaBell, FaQuestionCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const HeaderDashboard = ({ title }) => {
    const navigate = useNavigate()
    return (
        <div className="flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">

            {/* LEFT */}
            <div className="flex items-center gap-2">
                <button onClick={() => navigate('/dashboard')}>
                    <FaArrowLeft className="mt-1" />
                </button>
                <h1 className="text-xl font-semibold">
                    {title || "Quản lý sản phẩm"}
                </h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm hệ thống..."
                        className="pl-4 pr-10 py-2 rounded-full bg-gray-100 focus:bg-white border border-transparent focus:border-blue-300 outline-none transition-all duration-200"
                    />
                </div>

                {/* Bell */}
                <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition">
                    <FaBell className="text-lg text-gray-600 hover:text-blue-600" />

                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                        3
                    </span>
                </div>

                {/* Help */}
                <div className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition">
                    <FaQuestionCircle className="text-lg text-gray-600 hover:text-blue-600" />
                </div>
            </div>
        </div>
    );
};

export default HeaderDashboard;