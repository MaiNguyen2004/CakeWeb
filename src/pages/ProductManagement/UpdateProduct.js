import HeaderDashboard from '../../components/layout/HeaderDashboard'
import Sidebar from '../../components/layout/Sidebar'
import Selector from '../../components/common/SelectorForm';
import ImageUploader from "../../components/common/ImageUploader";
import ToggleSwitch from '../../components/common/ToggleSwitch'
import Error from '../../components/common/ErrorMessage'
import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getProductByIdAPI, updateProductByIdAPI } from '../../services/product.service'
import { useParams } from "react-router-dom";
import { toBase64 } from '../../utils/imgBase64'
export default function UpdateProduct() {
    const [form, setForm] = useState({})

    const [variants, setVariants] = useState([
        { size: "", price: "", stock: "" },
    ]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            const dataProduct = await getProductByIdAPI(id);
            // 🔥 SET FORM TẠI ĐÂY
            setForm({
                name: dataProduct.name || "",
                slug: dataProduct.slug || "",
                description: dataProduct.description || "",
                category: dataProduct.categoryId?.name || "",
                images: dataProduct.images || [],
                discount: {
                    percent: dataProduct.discount?.percent || 0,
                    startDate: formatDate(dataProduct.discount?.startDate) || "",
                    endDate: formatDate(dataProduct.discount?.endDate) || ""
                },
                tags: dataProduct.tags,
                isActive: dataProduct.isActive ?? true
            });

            // 🔥 SET VARIANTS
            setVariants(
                dataProduct.variants?.length > 0
                    ? dataProduct.variants
                    : [{ size: "", price: "", stock: "" }]
            );
        };

        fetchData();
    }, [id])

    // console.log("pro: ", product);

    const handleChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
        // 🔥 clear error
        setErrors(prev => ({
            ...prev,
            [`${field}_${index}`]: ""
        }));
    };

    const addVariant = () => {
        setVariants([...variants, { size: "", price: "", stock: "" }]);
    };
    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const validate = () => {
        const newErrors = {};
        if (form.images.length === 0) {
            newErrors.images = "Phải có ít nhất 1 ảnh"
        }

        if (variants.length === 0) {
            newErrors.variants = "Phải có ít nhất 1 biến thể";
        }
        variants.forEach((v, i) => {
            if (!v.size) {
                newErrors[`size_${i}`] = "Chưa nhập kích thước";
            }
            if (!v.price) {
                newErrors[`price_${i}`] = "Chưa nhập giá";
            }
            if (Number(v.price) < 0) {
                newErrors[`price_${i}`] = "Giá phải lớn hơn hoặc bằng 0";
            }
            if (Number(v.stock) < 0) {
                newErrors[`stock_${i}`] = "Số lượng còn phải lớn hơn hoặc bằng 0";
            }
        });
        if (form.discount.percent < 0 || form.discount.percent > 100) {
            newErrors.discount = "Discount phải nằm trong khoảng từ 0 đến 100";
        }

        if (
            form.discount.startDate &&
            form.discount.endDate &&
            form.discount.startDate > form.discount.endDate
        ) {
            newErrors.date = "Ngày bắt đầu giảm giá phải trước ngày kết thúc giảm giá.";
        }

        if (form.description.length > 1000) {
            newErrors.description = "Mô tả không được vượt quá 1000 ký tự";
        }

        return newErrors;
    };
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
    };


    const handleSubmit = async () => {
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        const base64Images = await Promise.all(
            form.images.map(img => toBase64(img))
        );
        const payload = {
            ...form,
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim(),
            variants: variants.map(v => ({
                size: v.size.trim(),
                price: Number(v.price),
                stock: Number(v.stock)

            })),
            images: base64Images,
            tags: form.tags || []
        };
        console.log("PAYLOAD:", payload);
        try {
            await updateProductByIdAPI(id, payload);

            toast.success("Cập nhật sản phẩm thành công!");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message)
            console.log("ERROR:", err.response?.data || err);
            alert(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };
    return (
        <div className="flex bg-gray-50">
            <Sidebar />
            <div className='flex-1'>
                <HeaderDashboard
                    title="Quản lý sản phẩm"
                    subtitle="Cập nhật sản phẩm"
                />

                <div className=" bg-white m-4 rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-md text-blue-800">Chỉnh sửa chi tiết</h2>
                    <h1 className="font-bold text-2xl">{form.name}</h1>

                    <p className="text-gray-500">Cập nhật hình ảnh, giá cả và thông tin mô tả cho sản phẩm cao cấp này để khách hàng luôn có thông tin chính xác nhất.</p>
                </div>

                <div className="px-4 min-h-screen">
                    <div className="grid grid-cols-3 gap-6">
                        {/* LEFT */}
                        <div className="">
                            <div className="bg-white p-6 rounded-2xl shadow-sm">
                                <h3 className="font-semibold mb-4">Hình ảnh sản phẩm</h3>
                                <ImageUploader
                                    value={form.images} // 🔥 truyền ảnh cũ từ DB (["abc.jpg"])
                                    onChange={(files) => setForm(prev => ({ ...prev, images: files }))}
                                    error={errors.images}
                                />
                                <div className="bg-blue-50 mt-6 p-4 rounded-xl text-sm text-gray-600">
                                    <p className="font-medium text-blue-600 mb-1">Mẹo trình bày</p>
                                    <p>Dùng ánh sáng tự nhiên để ảnh đẹp hơn.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm mt-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className='font-semibold mb-4'>
                                        <h5>Trạng thái hiển thị</h5>
                                    </div>
                                    <ToggleSwitch
                                        value={form.isActive}
                                        onChange={(val) =>
                                            setForm(prev => ({ ...prev, isActive: val }))
                                        }
                                    />
                                </div>
                                {form.isActive === true ? (
                                    <p className="text-gray-500">Sản phẩm này hiện đang công khai trên cửa hàng của bạn.</p>
                                ) : (
                                    <p className="text-gray-500">Sản phẩm này hiện đang bị ẩn trên cửa hàng của bạn.</p>
                                )}
                            </div>

                        </div>
                        {/* RIGHT */}
                        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">

                            <div className="grid grid-cols-2 mt-4 gap-4">
                                {/* name */}
                                <div>
                                    <label className="font-semibold">Tên sản phẩm</label>
                                    <input
                                        name='name'
                                        value={form.name}
                                        readOnly
                                        className={`w-full mt-1 p-3 rounded-xl text-gray-600 border bg-gray-100 outline-none`} />
                                </div>
                                {/* category */}
                                <div flex flex-col gap-2>
                                    <label className="font-semibold gap-2">Danh mục</label>
                                    <input
                                        name='categoryId'
                                        value={form.category}
                                        readOnly
                                        className={`w-full mt-1 p-3 rounded-xl text-gray-600 border bg-gray-100 outline-none`} />


                                </div>
                                {/* size price stock */}
                                <div className="col-span-2">
                                    {variants.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 gap-4 items-start mt-4"
                                        >
                                            {/* Size */}
                                            <div className="col-span-4 flex flex-col">
                                                <label className="font-semibold mb-1">Kích thước</label>
                                                <input
                                                    placeholder="Size (S, M, L...)"
                                                    value={item.size}
                                                    onChange={(e) =>
                                                        handleChange(index, "size", e.target.value)
                                                    }
                                                    className={`p-3 rounded-xl outline-none border 
                    ${errors[`size_${index}`] ? "border-red-400 bg-red-50" : "bg-gray-100"}`}
                                                />
                                                <div className="min-h-[18px]">
                                                    <Error message={errors[`size_${index}`]} />
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-4 flex flex-col">
                                                <label className="font-semibold mb-1">Giá</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    placeholder="Giá"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        handleChange(index, "price", e.target.value)
                                                    }
                                                    className={`p-3 rounded-xl outline-none border 
                    ${errors[`price_${index}`] ? "border-red-400 bg-red-50" : "bg-gray-100"}`}
                                                />
                                                <div className="min-h-[18px]">
                                                    <Error message={errors[`price_${index}`]} />
                                                </div>
                                            </div>

                                            {/* Stock */}
                                            <div className="col-span-3 flex flex-col">
                                                <label className="font-semibold mb-1">Số lượng</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    placeholder="Tồn kho"
                                                    value={item.stock}
                                                    onChange={(e) =>
                                                        handleChange(index, "stock", e.target.value)
                                                    }
                                                    className={`p-3 rounded-xl outline-none border 
                    ${errors[`stock_${index}`] ? "border-red-400 bg-red-50" : "bg-gray-100"}`}
                                                />
                                                <div className="min-h-[18px]">
                                                    <Error message={errors[`stock_${index}`]} />
                                                </div>
                                            </div>

                                            {/* Remove button */}
                                            <div className="col-span-1 flex items-center justify-center mt-6">
                                                {variants.length > 1 && (
                                                    <button
                                                        onClick={() => removeVariant(index)}
                                                        className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Error chung */}
                                    <div className="mt-2">
                                        <Error message={errors.variants} />
                                    </div>

                                    {/* Add button */}
                                    <button
                                        onClick={addVariant}
                                        className="flex items-center mt-4 gap-2 text-sm px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    >
                                        <FaPlus /> Thêm kích thước
                                    </button>
                                </div>
                                <div className="col-span-2 grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="font-semibold">Giảm giá</label>
                                        <input
                                            type='number'
                                            min={0}
                                            max={100}
                                            value={form.discount?.percent}
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    discount: {
                                                        ...form.discount,
                                                        percent: Number(e.target.value)
                                                    }
                                                });

                                                // clear error
                                                setErrors(prev => ({ ...prev, discount: "" }));
                                            }}
                                            className="w-full mt-1 p-3 bg-gray-100 rounded-xl outline-none" />
                                        <Error message={errors.discount} />

                                    </div>
                                    <div>
                                        <label className="font-semibold">Thời gian bắt đầu</label>
                                        <input
                                            type='date'
                                            value={form.discount?.startDate}
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    discount: {
                                                        ...form.discount,
                                                        startDate: e.target.value
                                                    }
                                                })
                                            }}
                                            className="w-full mt-1 p-3 bg-gray-100 rounded-xl outline-none" />

                                    </div>
                                    <div>
                                        <label className="font-semibold">Thời gian kết thúc</label>
                                        <input
                                            type='date'
                                            value={form.discount?.endDate}
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    discount: {
                                                        ...form.discount,
                                                        endDate: e.target.value
                                                    }
                                                });

                                                // clear error
                                                setErrors(prev => ({ ...prev, date: "" }));
                                            }}
                                            className="w-full mt-1 p-3 bg-gray-100 rounded-xl outline-none" />
                                        <Error message={errors.date} />
                                    </div>
                                </div>

                            </div>

                            <div className="mt-4">
                                <label className="font-semibold">Mô tả</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => {
                                        setForm({ ...form, description: e.target.value })
                                        setErrors(prev => ({ ...prev, description: "" }));
                                    }}
                                    placeholder='Nhập câu chuyện đằng sau chiếc bánh tuyệt vời này ...'
                                    className="w-full mt-1 p-3 bg-gray-100 rounded-xl h-24 outline-none" />
                                <Error message={errors.description} />

                            </div>
                            <Selector
                                value={form.tags || []}
                                onChange={(tags) =>
                                    setForm(prev => ({ ...prev, tags }))
                                }
                            />
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="px-4 py-2">Huỷ bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-3xl">
                                    Lưu sản phẩm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
}
