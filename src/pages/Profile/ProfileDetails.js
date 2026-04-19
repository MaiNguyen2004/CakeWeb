import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaAward, FaTools } from "react-icons/fa";
import Header from '../../components/layout/HeaderDashboard'
import Sidebar from '../../components/layout/SidebarUser'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'

import { formatDateVN } from "../../utils/calcul";

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="bg-gray-100 p-3 rounded-lg text-gray-600">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    </div>
);
export default function ProfileDetail() {
    const navigate = useNavigate()
    const { user } = useAuth()
    return (
        <div className="flex">
            <Sidebar />
            <div className='flex-1 bg-gray-100'>
                <Header title='Thông tin cá nhân' />

                {/* BODY */}
                <div className="px-20 py-10 grid grid-cols-3 gap-8">

                    {/* LEFT PROFILE */}
                    <div className="text-center">
                        <img
                            src={user.avatar}
                            className="w-68 h-72 object-cover border-4 border-white rounded-2xl mx-auto"
                        />
                        <h2 className="text-2xl font-semibold mt-4">
                            {user.nickName}
                        </h2>
                        <p className="text-gray-500">
                            {user.bio}
                        </p>

                        {/* BADGE */}
                        <div className="flex gap-4 mt-6">
                            <div className="flex-1 bg-[#EEF1F3] border-2 border-gray-200 p-4 rounded-xl">
                                <FaAward className="text-yellow-500 text-2xl mx-auto mb-2" />
                                <p className="text-sm">HẠNG VÀNG</p>
                            </div>
                            <div className="flex-1 bg-[#EEF1F3] border-2 border-gray-200 p-4 rounded-xl">
                                <FaTools className="text-blue-500 text-2xl mx-auto mb-2" />
                                <p className="text-sm">CHUYÊN GIA</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-2 space-y-6">

                        {/* INFO */}
                        <div className="p-6 bg-white rounded-2xl shadow relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Thông tin chi tiết
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Quản lý các thông tin cá nhân của bạn để có trải nghiệm dịch vụ tốt nhất
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/updateProfile")}
                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full">
                                    <FaEdit /> Chỉnh sửa thông tin
                                </button>
                            </div>

                            {/* GRID INFO */}
                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <InfoItem icon={<FaEnvelope />} label="Nick name" value={user.nickName} />
                                <InfoItem icon={<FaEnvelope />} label="Họ và tên" value={user.fullName} />

                                <InfoItem icon={<FaEnvelope />} label="EMAIL" value={user.email} />
                                <InfoItem icon={<FaPhone />} label="SỐ ĐIỆN THOẠI" value={user.phone} />
                                <InfoItem icon={<FaEnvelope />} label="GIỚI TÍNH" value={user.gender} />
                                <InfoItem icon={<FaCalendarAlt />} label="NGÀY SINH" value={user.dob ? user.dob : (<p className="text-gray-300">Chưa có</p>)} />
                                <InfoItem icon={<FaMapMarkerAlt />} label="ĐỊA CHỈ" value={user.address ? user.address : (<p className="text-gray-300">Chưa có</p>)} />
                                <InfoItem icon={<FaCalendarAlt />} label="THAM GIA TỪ" value={formatDateVN(user.createdAt)} />
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 gap-6">

                            <div className="bg-blue-50 p-6 rounded-2xl border-blue-100 border-2">
                                <h3 className="font-semibold text-xl text-blue-800">
                                    Đơn hàng gần đây
                                </h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Bạn có 3 đơn hàng đang được xử lý
                                </p>
                                <button className="text-blue-900 mt-4">
                                    Xem lịch sử mua hàng →
                                </button>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-2xl border-purple-100 border-2">
                                <h3 className="font-semibold text-purple-700">
                                    Điểm thưởng tích lũy
                                </h3>
                                <p className="text-3xl font-bold text-purple-600 mt-2">
                                    2,450 pts
                                </p>
                                <button className="text-purple-600 mt-4">
                                    Đổi quà tặng ngay 🎁
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}