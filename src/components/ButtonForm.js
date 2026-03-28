import { useNavigate } from "react-router-dom";
const Button = ({ text, onClick }) => {
    const navigate = useNavigate();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                // navigate(to);
            }}
        >
            <button
                onClick={onClick}
                className="border-2 border-white px-8 py-2 rounded-full hover:bg-white hover:text-blue-600 transition duration-200 font-medium"
            >
                {text}
            </button>
        </form>
    );
};

export default Button