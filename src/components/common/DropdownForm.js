import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({
    data = [],            // mảng dữ liệu
    value,                // giá trị đang chọn
    onChange,             // callback
    labelKey = "name",    // field hiển thị
    valueKey = "_id",     // field value
    placeholder = "Chọn",
    error,
    className = "",

}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedItem = data.find(item => item[valueKey] === value);

    return (
        <div ref={dropdownRef} className="relative w-full">
            {/* Selected */}
            <div
                onClick={() => setOpen(!open)}
                className={` ${className}
                    flex items-center justify-between 
                    px-4 py-3 rounded-lg cursor-pointer
                    border text-sm transition duration-200
                    ${value ? "bg-blue-50" : "bg-white border-gray-200"}
                    hover:bg-blue-50
                    ${open ? "ring-2 ring-gray-200 border-gray-400" : ""}
                `}
            >
                <span>
                    {selectedItem ? selectedItem[labelKey] : placeholder}
                </span>

                <FaChevronDown
                    className={`transition ${open ? "rotate-180" : ""}`}
                />
            </div>

            {/* Dropdown list */}
            {open && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
                    {data.map((item) => (
                        <div
                            key={item[valueKey]}
                            onClick={() => {
                                onChange(item[valueKey]);
                                setOpen(false);
                            }}
                            className={`
                                px-4 py-2 text-sm cursor-pointer 
                                hover:bg-blue-100
                                ${value === item[valueKey]
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : ""
                                }
                            `}
                        >
                            {item[labelKey]}
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Dropdown;