import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { formatPrice } from "../../utils/calcul";

const CartItemCard = ({ item, isSelected, onSelect, onRemove, onIncrease, onDecrease, onChangeSize }) => {
  const sizeOptions =
    Array.isArray(item.availableSizes) && item.availableSizes.length > 0
      ? item.availableSizes
      : [item.size];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect(item.id);
      }}
      className={[
        "flex items-center gap-4 rounded-2xl p-4 shadow-sm transition",
        "cursor-pointer select-none outline-none",
        "bg-white hover:shadow-md",
        isSelected
          ? "bg-green-50 ring-2 ring-green-300 shadow-[0_12px_30px_rgba(34,197,94,0.22)]"
          : "ring-1 ring-transparent",
      ].join(" ")}
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-24 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
        <div className="mt-2">
          <select
            value={item.size}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChangeSize(item, e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700"
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                Size: {size}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-lg font-semibold text-blue-600">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-full bg-gray-100 px-4 py-2">
        <button
          className="text-gray-500"
          type="button"
          aria-label="Giảm số lượng"
          onClick={(e) => {
            e.stopPropagation();
            onDecrease(item);
          }}
        >
          <FaMinus size={12} />
        </button>
        <span className="w-4 text-center font-medium">{item.quantity}</span>
        <button
          className="text-gray-500"
          type="button"
          aria-label="Tăng số lượng"
          onClick={(e) => {
            e.stopPropagation();
            onIncrease(item);
          }}
        >
          <FaPlus size={12} />
        </button>
      </div>

      <div className="w-28 text-right text-xl font-semibold text-gray-800">
        {formatPrice(item.price * item.quantity)}
      </div>

      <button
        className="text-gray-400 hover:text-red-500"
        type="button"
        aria-label="Xóa khỏi giỏ"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item);
        }}
      >
        <FaTrashAlt />
      </button>
    </article>
  );
};

export default CartItemCard;
