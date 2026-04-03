import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value = 0 }) => {
    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(value)) {
                stars.push(
                    <FaStar key={i} className="text-yellow-400" />
                );
            } else if (i - value < 1) {
                stars.push(
                    <FaStarHalfAlt key={i} className="text-yellow-400" />
                );
            } else {
                stars.push(
                    <FaRegStar key={i} className="text-gray-300" />
                );
            }
        }

        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-500">
                {value}
            </span>
        </div>
    );
};

export default Rating;