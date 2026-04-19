import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}) {
    if (!totalPages || totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-4 mt-4">
            {/* Text bên trái */}
            <h5 className="text-md text-blue-800 font-semibold">
                Hiển thị {endItem - startItem + 1} trong tổng số {totalItems} sản phẩm
            </h5>

            {/* Pagination bên phải */}
            <div className="flex items-center gap-2">
                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 disabled:opacity-50"
                >
                    <FaChevronLeft size={12} />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 rounded-md text-sm font-medium ${currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 disabled:opacity-50"
                >
                    <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}