import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/ButtonForm'
import Input from '../../components/common/InputForm'
import Dropdown from '../../components/common/DropdownForm'
import SubmitButton from '../../components/common/SubmitButton'
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { register } from '../../services/user.service'
import { getRoleName } from '../../services/role.service';
import Login from "../Auth/Login";

function Registration({ onClose }) {
    const navigation = useNavigate()
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        nickName: '',
        email: '',
        password: '',
        phone: "",
        roleId: ""

    });
    useEffect(() => {
        const fetchRoles = async () => {
            const data = await getRoleName();
            setRoles(data);
        };
        fetchRoles();
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const validateForm = () => {
        const errors = {};

        // Full name
        if (!formData.nickName.trim()) {
            errors.nickName = "Biệt danh không được để trống";
        }

        // Email
        if (!formData.email) {
            errors.email = "Email không được để trống";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = "Email không hợp lệ";
        }

        // Password
        if (!formData.password) {
            errors.password = "Mật khẩu không được để trống";
        } else if (formData.password.length < 6) {
            errors.password = "Mật khẩu phải ít nhất 6 ký tự";
        }

        // Phone
        if (!formData.phone) {
            errors.phone = "Số điện thoại không được để trống";
        } else if (!/^[0-9]{9,11}$/.test(formData.phone)) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        // Role
        if (!formData.roleId) {
            errors.roleId = "Vui lòng chọn role";
        }

        return errors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await register(formData);
            alert("Đăng ký thành công 🎉");
            console.log(res);

            // reset form
            setFormData({
                nickName: '',
                email: '',
                password: '',
                phone: "",
                roleId: ""
            });
            navigation("/login")
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-[1000px] relative overflow-hidden shadow-2lg"
                onClick={(e) => e.stopPropagation()} >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500"
                >
                    ✕
                </button>
                <div className="w-full h-[650px] bg-white flex overflow-hidden">

                    {/* LEFT - Registration Form */}
                    <div className="w-1/2 px-10 py-8 flex flex-col justify-center">
                        <h2 className="text-2xl text-center font-bold text-gray-800 ">Registration</h2>

                        <Input
                            icon={FaUser}
                            type="text"
                            name="nickName"
                            placeholder="Biệt danh"
                            value={formData.nickName}
                            onChange={handleInputChange}
                            error={errors.nickName}
                            className="mb-4"

                        />
                        {/* Email Input */}
                        <Input
                            icon={FaEnvelope}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            className="mb-4"

                        />

                        {/* Password Input */}
                        <Input
                            icon={FaLock}
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                            className="mb-4"

                        />
                        <Input
                            icon={FaPhone}
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleInputChange}
                            error={errors.phone}
                            className="mb-4"

                        />
                        <Dropdown
                            data={roles}
                            labelKey='name'
                            valueKey='_id'
                            placeholder='Chọn role'
                            value={formData.roleId}
                            onChange={(roleId) =>
                                setFormData({ ...formData, roleId })
                            }
                            error={errors.roleId}
                            className="mb-4"

                        />

                        {/* Register Button */}
                        <SubmitButton onClick={handleSubmit} text="Register" />

                        {/* Social Platforms Section */}
                        <p className="text-l text-gray-800 text-center mb-4">
                            or register with social platforms
                        </p>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-3">
                            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition text-gray-600 font-medium">
                                G
                            </div>
                            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition text-gray-600 font-medium">
                                f
                            </div>
                            <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 cursor-pointer transition text-gray-600 font-medium">
                                in
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Welcome Section */}
                    <div className="w-1/2 bg-gradient-to-br from-blue-200 to-blue-600 text-white flex flex-col items-center justify-center rounded-l-[100px]">
                        {/* <div className="text-center px-8"> */}
                        <h2 className="text-3xl font-bold">Welcome Back!</h2>
                        <p className="text-sm mb-8 opacity-90 mb-6 text-center">Already have an Account</p>

                        <Button text="Login" onClick={() => setIsOpenModal(true)} />
                        {/* </div> */}
                    </div>
                </div>
            </div>
            {isOpenModal && (
                <Login onClose={() => setIsOpenModal(false)} />
            )}
        </div>
    );
}

export default Registration;