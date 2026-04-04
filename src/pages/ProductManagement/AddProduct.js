import HeaderDashboard from '../../components/layout/HeaderDashboard'
import Sidebar from '../../components/layout/Sidebar'
import Selector from '../../components/common/SelectorForm';
import DropdownForm from '../../components/common/DropdownForm'
import ImageUploader from "../../components/common/ImageUploader";
import Error from '../../components/common/ErrorMessage'
import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getCategoriesAPI } from '../../services/category.service'
import { addNewProduct } from '../../services/product.service'
import { toBase64 } from '../../utils/imgBase64'

export default function AddProduct() {
    const [cateName, setCateName] = useState([])
    const [variants, setVariants] = useState([
        { size: "", price: "", stock: "" },
    ]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const data = await getCategoriesAPI();
            // console.log("data:", data);
            setCateName(data)
        };
        fetchData();
    }, []);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        variants: [],
        discount: {
            percent: 0,
            startDate: new Date(),
            endDate: new Date()
        },
        categoryId: "",
        images: [],
        // sellerId: user.id,
        tags: [],
        isActive: true
    });
    const generateSlug = (str) => {
        return str
            .toLowerCase()
            .normalize("NFD") // tách dấu
            .replace(/[\u0300-\u036f]/g, "") // xoá dấu
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự đặc biệt
            .trim()
            .replace(/\s+/g, "-"); // space -> -
    };
    const handleChange = (index, field, value) => {
        const newVariants = [...variants];

        newVariants[index][field] =
            field === "price" || field === "stock"
                ? Number(value)
                : value;

        setVariants(newVariants);

        setErrors(prev => ({
            ...prev,
            [`${field}_${index}`]: ""
        }));
    };
    const addVariant = () => {
        setVariants([...variants, { size: "", price: 0, stock: 0 }]);
    };
    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            const slug = generateSlug(value);

            setForm(prev => ({
                ...prev,
                name: value,
                slug
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }

        // 🔥 XÓA ERROR KHI USER NHẬP LẠI
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (form.images.length === 0) {
            newErrors.images = "Phải có ít nhất 1 ảnh"
        }

        if (!form.name.trim()) {
            newErrors.name = "Tên không được trống";
        } else if (form.name.length > 100) {
            newErrors.name = "Tên không được vượt quá 100 ký tự";
        }

        if (!form.categoryId) {
            newErrors.categoryId = "Chưa chọn danh mục";
        }

        if (variants.length === 0) {
            newErrors.variants = "Phải có ít nhất 1 biến thể";
        }
        variants.forEach((v, i) => {
            if (!v.size) {
                newErrors[`size_${i}`] = "Chưa nhập kích thước";
            }
            if (v.price === "" || v.price === null) {
                newErrors[`price_${i}`] = "Giá chỉ chứa số";
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


    const handleSubmit = async () => {
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        try {
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
                images: base64Images // 🔥 quan trọng
            };

            console.log("PAYLOAD:", payload);

            await addNewProduct(payload);

            toast.success("Thêm sản phẩm thành công!");
            setTimeout(() => navigate("/dashboard"), 1500);

        } catch (err) {
            toast.error(err.response?.data?.message);
            alert(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };
    return (
        <div className="flex bg-gray-50">
            <Sidebar />
            <div className='flex-1'>
                <HeaderDashboard
                    title="Quản lý sản phẩm"
                    subtitle="Thêm mới sản phẩm"
                />

                <div className=" bg-white m-4 rounded-xl shadow-sm p-4">
                    <h2 className="font-bold text-xl">Thông tin bánh mới</h2>
                    <p className="text-gray-500">Hãy tạo nên một tuyệt tác mới cho thực đơn của bạn.</p>
                </div>

                <div className="px-4 min-h-screen">
                    <div className="grid grid-cols-3 gap-6">
                        {/* LEFT */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-semibold mb-4">Hình ảnh sản phẩm</h3>
                            <ImageUploader
                                onChange={(files) => {
                                    setForm(prev => ({ ...prev, images: files }))
                                    setErrors(prev => ({ ...prev, images: "" }));
                                }}
                                error={errors.images}
                            />

                            <div className="bg-blue-50 mt-6 p-4 rounded-xl text-sm text-gray-600">
                                <p className="font-medium text-blue-600 mb-1">Mẹo trình bày</p>
                                <p>Dùng ánh sáng tự nhiên để ảnh đẹp hơn.</p>
                            </div>
                        </div>
                        {/* RIGHT */}
                        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">

                            <div className="grid grid-cols-2 mt-4 gap-4">
                                <div>
                                    <label className="font-semibold">Tên bánh</label>
                                    <input
                                        name='name'
                                        value={form.name}
                                        onChange={handleFormChange}
                                        placeholder='VD: Bánh Kem Việt Quất Kem Phô Mai'
                                        className={`w-full mt-1 p-3 rounded-xl border bg-gray-100 outline-none`} />
                                    <Error message={errors.name} />
                                </div>

                                <div>
                                    <label className="font-semibold">Slug</label>
                                    <input
                                        name="slug"
                                        value={form.slug}
                                        readOnly
                                        className="w-full mt-1 p-3 bg-gray-100 rounded-xl outline-none" />
                                </div>
                                <div flex flex-col gap-2>
                                    <label className="font-semibold gap-2">Danh mục</label>
                                    <DropdownForm
                                        labelKey='name'
                                        valueKey='_id'
                                        data={cateName}
                                        value={form.categoryId}
                                        onChange={(categoryId) => {
                                            setForm(prev => ({ ...prev, categoryId }))
                                            setErrors(prev => ({
                                                ...prev,
                                                categoryId: ""
                                            }));
                                        }}
                                        placeholder='Chọn loại bánh'
                                    />
                                    <Error message={errors.categoryId} />

                                </div>
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
                                            value={form.discount.percent}
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
                                value={form.tags}
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
