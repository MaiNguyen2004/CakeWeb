import { FaShoppingCart, FaEye } from "react-icons/fa";
import ProductModal from "../../pages/ProductManagement/ProductDetail";
import { useState } from "react";

const CardProduct = ({ product, addCartItem, onBuyNow }) => {
    const minPrice = Math.min(...product.variants.map(v => v.price));
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleView = (product) => {
        setSelectedProduct(product);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedProduct(null);
    };
    return (
        <div className="w-50 bg-white rounded-xl shadow-sm p-2 group relative hover:shadow-md transition">

            {/* Badge */}
            {/* <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                NEW
            </span> */}

            {/* Image */}
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={Array.isArray(product.img) ? product.img[0] : product.img}
                    alt=""
                    className="h-60 w-full object-cover group-hover:scale-105 transition"
                />

                {/* Hover actions */}
                <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                        onClick={() => handleView(product)}
                        className="bg-white p-2 rounded-full shadow">
                        <FaEye />
                    </button>
                    <button
                        onClick={() => addCartItem(product)}
                        className="bg-white p-2 rounded-full shadow"
                    >
                        <FaShoppingCart />
                    </button>
                </div>
            </div>

            {/* Info */}
            <p className="text-gray-400 text-xs mt-3">{product.category.categoryName}</p>

            <h3 className="font-medium mt-1 line-clamp-1">
                {product.name}
            </h3>

            <div className="flex items-center justify-between mt-1">
                <p className="text-blue-500 font-semibold">
                    {minPrice} đ
                </p>

                <button
                    onClick={() => onBuyNow(product)}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                >
                    Đặt ngay
                </button>
            </div>
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default CardProduct;