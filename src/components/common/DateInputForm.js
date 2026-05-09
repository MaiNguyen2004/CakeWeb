import React from "react";

const DateInputForm = ({
    type = "datetime-local",
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
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full px-4 py-3
            border rounded-lg
            focus:outline-none focus:ring-2
            text-sm transition duration-200
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-600 focus:ring-blue-300"}
            ${iconPosition === "right" ? "pr-12" : "pl-12"}
            ${value ? "bg-blue-50 border-blue-500 ring-1 ring-blue-300" : "bg-white"}
            ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}
          `}
                    {...props}
                />
                {Icon && (
                    <div
                        className={`absolute inset-y-0 flex items-center ${iconPosition === "right" ? "right-3" : "left-3"
                            }`}
                    >
                        <Icon className={`text-blue-600 ${iconClassName}`} />
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default DateInputForm;
