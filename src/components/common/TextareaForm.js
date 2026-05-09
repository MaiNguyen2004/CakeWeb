import React from "react";

const TextareaForm = ({
    placeholder = "",
    value,
    onChange,
    rows = 3,
    error = "",
    disabled = false,
    className = "",
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
                disabled={disabled}
                className={`
          w-full px-4 py-3
          border rounded-lg
          focus:outline-none focus:ring-2
          text-sm transition duration-200
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-blue-600 focus:ring-blue-300"}
          ${value ? "bg-blue-50 border-blue-500 ring-1 ring-blue-300" : "bg-white"}
          ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}
        `}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default TextareaForm;
