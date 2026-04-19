import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaAward, FaTools } from "react-icons/fa";
import Header from '../../components/layout/HeaderDashboard'
import Sidebar from '../../components/layout/SidebarUser'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'
import { useState } from "react";
import { formatDateVN } from "../../utils/calcul";


export default function ProfileDetail() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [form, setForm] = useState({
        nickName: user?.nickName || "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        gender: user?.gender || "",
        address: user?.address || "",
        dob: user?.dob ? user.dob.split("T")[0] : ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {

    }
    return (
        <div className="flex">
            <Sidebar />
            <div className='flex-1 bg-gray-100'>
                <Header title='Chỉnh sửa thông tin' />

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
                        <div className="bg-blue-100 p-6 rounded-2xl mt-6">
                            <h3 className="font-semibold text-xl text-blue-800">
                                Ưu đãi hôm nay
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                                Cập nhật đầy đủ thông tin để nhận được quà tặng bất ngờ vào ngày sinh nhật của bạn!
                            </p>
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

                            </div>

                            <div className="p-10">
                                {/* Nickname */}
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 font-semibold text-gray-800">Nick name</p>
                                        <input
                                            name="nickName"
                                            value={form.nickName}
                                            onChange={handleChange}
                                            placeholder="Nickname"
                                            className="w-full border p-3 rounded-lg"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 font-semibold text-gray-800">Họ và tên</p>
                                        <input
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            placeholder="Họ và tên"
                                            className="w-full border p-3 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 font-semibold text-gray-800">Email</p>
                                        <input
                                            name="email"
                                            value={form.email}
                                            disabled
                                            className="w-full border p-3 rounded-lg bg-gray-100"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 my-2 font-semibold text-gray-800">Số điện thoại</p>
                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="Số điện thoại"
                                            className="w-full border p-3 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 my-2 font-semibold text-gray-800">Giới tính</p>
                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            className="w-full border p-3 rounded-lg"
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 my-2 font-semibold text-gray-800">Ngày, tháng, năm sinh</p>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={form.dob}
                                            onChange={handleChange}
                                            className="w-full border p-3 rounded-lg"
                                        />

                                    </div>


                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="col-span-1">
                                        <p className="text-ms my-2 my-2 font-semibold text-gray-800">Địa chỉ</p>
                                        <input
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Địa chỉ"
                                            className="w-full border p-3 rounded-lg"
                                        />
                                    </div>

                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={() => navigate("/profile")}
                                        className="px-4 py-2">Huỷ bỏ</button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-3xl">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}