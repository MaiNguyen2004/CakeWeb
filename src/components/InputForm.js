// Input.jsx - Phiên bản nâng cao
import React from 'react';

const Input = ({
    type = "text",
    placeholder = "",
    value,
    onChange,
    icon: Icon,
    iconPosition = "right",
    iconClassName = "",
    error = "",
    disabled = false,
    className = "",
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full px-4 py-3 
            border rounded-lg 
            focus:outline-none focus:ring-2 
            bg-white text-sm
            transition duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}
            ${iconPosition === "right" ? "pr-12" : "pl-12"}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
          `}
                    {...props}
                />
                {Icon && (
                    <div className={`absolute inset-y-0 flex items-center ${iconPosition === "right" ? "right-3" : "left-3"
                        }`}>
                        <Icon className={`w-5 h-5} ${iconClassName}`} />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Input;