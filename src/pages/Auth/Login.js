import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Input from '../../components/common/InputForm';
import Button from '../../components/common/ButtonForm';
import SubmitButton from '../../components/common/SubmitButton';
import { useAuth } from '../../context/AuthContext';
import { login as loginAPI } from '../../services/user.service'
import Registers from "./Register";

const Login = ({ onClose }) => {
    const navigate = useNavigate();
    const { login } = useAuth()
    const [errors, setErrors] = useState({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        setErrors({});
        setLoading(true);

        const { email, password } = formData;
        const newErrors = {};

        // Check empty
        if (!email) newErrors.email = "Email không được để trống";
        if (!password) newErrors.password = "Mật khẩu không được để trống";

        // Check format email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (email && !emailRegex.test(email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await loginAPI(formData); // gọi API login
            const data = res.data || res;

            // ✅ gọi context để set user
            login(data.user);
            console.log("user: ", data.user)

            // Lưu token
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            localStorage.setItem("user", JSON.stringify(res.user));
            alert("Login thành công!");
            onClose();
            navigate("/"); // navigate về home
        } catch (err) {
            console.log(err)
            setErrors({ general: err.response?.data?.message || "Login thất bại" });
        } finally {
            setLoading(false);
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

                    {/* LEFT PANEL */}
                    <div className="w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#38bdf8] text-white flex flex-col items-center justify-center rounded-r-[100px]">
                        <h2 className="text-3xl font-bold mb-3">Hello, Friend!</h2>
                        <p className="text-sm mb-8 opacity-90">
                            Register with your personal details
                        </p>
                        <Button
                            text="Register"
                            onClick={() => setIsOpenModal(true)}
                        />
                    </div>

                    {/* RIGHT FORM */}
                    <div className="w-1/2 px-14 flex flex-col justify-center">

                        <h2 className="text-2xl font-bold text-gray-700 mb-8 text-center">
                            Sign in
                        </h2>

                        <Input
                            icon={FaEnvelope}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                        />

                        <Input
                            icon={FaLock}
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />

                        {errors.general && <p className="text-red-600 text-sm mb-2">{errors.general}</p>}

                        <SubmitButton
                            text="Login"
                            onClick={handleLogin}
                            loading={loading}
                        />
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
                </div>
            </div>
            {isOpenModal && (
                <Registers onClose={() => setIsOpenModal(false)} />
            )}
        </div>

    );
};

export default Login;