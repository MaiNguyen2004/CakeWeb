import { useState } from "react";
import { FaBox, FaUsers, FaFileInvoice, FaChartBar, FaCog, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Sidebar Component
const Sidebar = () => {
    const menu = [
        { name: "Orders", icon: <FaFileInvoice /> },
        { name: "Products", icon: <FaBox />, active: true },
        { name: "Customers", icon: <FaUsers /> },
        { name: "Marketing", icon: <FaChartBar /> },
        { name: "Settings", icon: <FaCog /> },
    ];

    return (
        <div className="w-64 bg-gray-100 h-screen p-5 flex flex-col justify-between">
            <div>
                <h1 className="text-xl font-bold mb-6">Bakery Admin</h1>
                <ul className="space-y-3">
                    {menu.map((item, index) => (
                        <li
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${item.active ? "bg-white text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
                        >
                            {item.icon}
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-full">
                <FaPlus /> New Product
            </button>
        </div>
    );
};// Card Component

export default Sidebar