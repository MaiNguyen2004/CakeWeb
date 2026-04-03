import React from "react";
import Rating from "../../components/ui/RatingForm";

const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);

    const finalPrice = product.discount
        ? minPrice - (minPrice * product.discount) / 100
        : minPrice;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-[800px] p-6 relative shadow-lg"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 text-lg"
                >
                    ✕
                </button>

                <div className="flex gap-6 h-[350px]">

                    {/* LEFT - IMAGE */}
                    <div className="w-1/2">
                        <img
                            src={product.img}
                            alt=""
                            className="w-full h-[350px] object-cover rounded-xl"
                        />
                    </div>

                    {/* RIGHT - INFO */}
                    <div className="w-1/2 flex flex-col justify-between h-full">
                        <div>
                            {/* NAME */}
                            <h2 className="text-3xl font-semibold">
                                {product.name}
                            </h2>

                            {/* CATEGORY + RATING */}
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-gray-400 text-sm">
                                    {product.category.categoryName}
                                </p>

                                {/* ⭐ Rating */}
                                <Rating value={product.rating} />
                            </div>

                            {/* PRICE + DISCOUNT */}
                            <div className="mt-3 flex items-center gap-3">
                                <p className="text-red-500 text-2xl font-bold">
                                    {finalPrice.toLocaleString()}đ
                                </p>

                                {product.discount > 0 && (
                                    <>
                                        <p className="text-gray-400 line-through text-sm">
                                            {minPrice.toLocaleString()}đ
                                        </p>

                                        <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded">
                                            -{product.discount}%
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* TAGS */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {product.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* BUTTON */}
                        <div className="flex gap-3">
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                Thêm vào giỏ hàng
                            </button>

                            <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;