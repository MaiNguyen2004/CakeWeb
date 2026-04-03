import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import cheBienBanh from '../assets/images/cheBienBanh.jpg';
import nguyenLieu from '../assets/images/nguyenLieuLamBanh.webp';


const Home = () => {
    return (
        <div className="bg-gray-50">
            <Header />

            {/* HERO */}
            <section className="flex items-center justify-between px-16 py-16">
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold leading-tight">
                        Thưởng thức sự{" "}
                        <span className="text-blue-500">thuần khiết</span> trong từng miếng
                        bánh.
                    </h1>

                    <p className="mt-6 text-gray-500">
                        Bánh tươi mỗi ngày, kết hợp nguyên liệu tự nhiên và tinh yêu từ
                        người thợ làm bánh.
                    </p>

                    <div className="mt-6 flex gap-4">
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-full">
                            Khám phá menu
                        </button>
                        <button className="border px-6 py-3 rounded-full">
                            Về chúng tôi
                        </button>
                    </div>
                </div>

                <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587"
                    alt="cake"
                    className="w-[400px] rounded-3xl shadow-lg"
                />
            </section>

            {/* FEATURES */}
            <section className="bg-gray-100 py-16 px-10">
                <div className="grid grid-cols-2 gap-10 items-center">

                    {/* LEFT - GRID IMAGE */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Image 1 */}
                        <img
                            src={nguyenLieu}
                            className="rounded-2xl h-80 w-full object-cover"
                        />

                        {/* Card Fresh */}
                        <div className="h-80 flex items-end">
                            <div className="bg-gray-200 rounded-2xl h-60 w-full flex flex-col justify-center items-center">
                                <h3 className="text-blue-600 text-xl font-semibold">Fresh</h3>
                                <p className="text-gray-500 text-sm">Làm mới mỗi ngày</p>
                            </div>
                        </div>

                        {/* Card 100% */}
                        <div className="h-40 flex items-start">
                            <div className="bg-blue-500 text-white rounded-2xl h-60 w-full flex flex-col justify-center items-center">
                                <h3 className="text-2xl font-bold">100%</h3>
                                <p className="text-sm">Nguyên liệu tự nhiên</p>
                            </div>
                        </div>

                        {/* Image 2 */}
                        <img
                            src={cheBienBanh}
                            className="rounded-2xl h-80 w-full object-cover"
                        />

                    </div>

                    {/* RIGHT - TEXT */}
                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Chất lượng là ưu tiên hàng đầu
                        </h2>

                        <p className="text-gray-500 mb-4 leading-relaxed">
                            Tại Cake, chúng tôi tin rằng mỗi chiếc bánh là một tác phẩm nghệ thuật.
                            Chúng tôi cam kết sử dụng nguyên liệu cao cấp nhất, từ bơ Pháp thượng hạng
                            đến trái cây tươi địa phương, để tạo ra những hương vị thuần khiết.
                        </p>

                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Bánh của chúng tôi được nướng mới mỗi ngày, không sử dụng chất bảo quản hay phẩm màu nhân tạo.
                        </p> {/* Stats */}
                        <div className="flex gap-10">
                            <div>
                                <h3 className="text-blue-500 text-xl font-bold">0%</h3>
                                <p className="text-gray-500 text-sm">Chất bảo quản</p>
                            </div>

                            <div>
                                <h3 className="text-blue-500 text-xl font-bold">24h</h3>
                                <p className="text-gray-500 text-sm">Tươi ngon tối đa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MENU */}
            <section className="px-16 py-10">
                <h2 className="text-2xl font-semibold mb-6">Menu nổi bật</h2>

                <div className="grid grid-cols-4 gap-6">
                    {[
                        {
                            name: "Blueberry Soufflé",
                            price: "450.000 VND",
                            img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
                        },
                        {
                            name: "Strawberry Silk",
                            price: "380.000 VND",
                            img: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
                        },
                        {
                            name: "Earl Grey Bliss",
                            price: "420.000 VND",
                            img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
                        },
                        {
                            name: "Matcha Zen",
                            price: "400.000 VND",
                            img: "https://images.unsplash.com/photo-1612197528506-4a9d7b4e6a0c",
                        },
                    ].map((cake, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                            <img
                                src={cake.img}
                                className="rounded-lg mb-3 h-40 w-full object-cover"
                            />
                            <h3 className="font-medium">{cake.name}</h3>
                            <p className="text-blue-500">{cake.price}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-16 py-16">
                <div className="bg-blue-600 text-white rounded-2xl p-10 text-center">
                    <h2 className="text-2xl font-semibold mb-4">
                        Nhận voucher 20% cho lần đặt đầu tiên
                    </h2>

                    <div className="flex justify-center gap-4">
                        <input
                            placeholder="Email của bạn"
                            className="px-4 py-2 rounded-full text-black"
                        />
                        <button className="bg-black px-6 py-2 rounded-full">
                            Đăng ký
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;