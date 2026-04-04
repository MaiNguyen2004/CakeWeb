// ToggleSwitch.js
export default function ToggleSwitch({ value = false, onChange }) {
    return (
        <button
            type="button"
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${value ? "bg-green-500" : "bg-gray-300"
                }`}
            onClick={() => onChange(!value)} // 🔥 bật/tắt
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${value ? "translate-x-6" : ""
                    }`}
            />
        </button>
    );
}