

// SubmitButton.js
const SubmitButton = ({ text, onClick, loading }) => (
    <button
        type="button" // type="button" để chỉ xử lý onClick
        onClick={onClick} // handle submit ở đây
        disabled={loading}
        className={`w-full py-2 px-4 rounded-3xl text-white font-semibold mb-6
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
    >
        {loading ? "Loading..." : text}
    </button>
);

export default SubmitButton;