import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartItemCard from "../components/ui/CartItemCard";
import { getCartByUser, removeCartItem, updateCartItemQuantity } from "../services/cart.service";
import { useAuth } from '../context/AuthContext'

const Cart = () => {
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [cart, setCart] = useState([])
    const { user } = useAuth()

    const fetchCart = async () => {
        const userId = user?._id ?? user?.id
        if (!userId) {
            setCart([])
            return
        }

        const items = await getCartByUser(userId)
        setCart(items)
    }

    useEffect(() => {
        fetchCart()
    }, [user])

    const cartItems = cart

    const chargedItems =
        selectedItemIds.length === 0
            ? cartItems
            : cartItems.filter((item) => selectedItemIds.includes(item.id));

    const subTotal = chargedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Math.round(subTotal * 0.1);
    const total = subTotal - discount;

    const formatPrice = (value) => `${value.toLocaleString("vi-VN")}đ`;

    const handleSelectItem = (itemId) => {
        setSelectedItemIds((current) =>
            current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]
        );
    };

    const handleRemoveItem = async (item) => {
        try {
            await removeCartItem({ productId: item.productId });
            setCart((current) =>
                current.filter((cartItem) => !(cartItem.productId === item.productId && cartItem.size === item.size))
            );
            setSelectedItemIds((current) => current.filter((id) => id !== item.id));
        } catch (error) {
            console.error("Remove cart item failed:", error);
            alert("Xóa sản phẩm khỏi giỏ thất bại.");
        }
    };

    const handleUpdateQuantity = async (item, action) => {
        try {
            const nextQuantity = action === "increase" ? item.quantity + 1 : item.quantity - 1;
            if (nextQuantity < 1) return;

            const response = await updateCartItemQuantity({
                productId: item.productId,
                size: item.size,
                quantity: nextQuantity,
            });

            const updatedQuantity = response?.item?.quantity;
            if (typeof updatedQuantity !== "number") return;

            setCart((current) =>
                current.map((cartItem) =>
                    cartItem.productId === item.productId && cartItem.size === item.size
                        ? { ...cartItem, quantity: updatedQuantity }
                        : cartItem
                )
            );
        } catch (error) {
            alert(error?.response?.data?.error || "Cập nhật số lượng thất bại.");
        }
    };

    const handleChangeSize = async (item, newSize) => {
        if (!newSize || newSize === item.size) return;

        try {
            await updateCartItemQuantity({
                productId: item.productId,
                size: newSize,
                quantity: item.quantity,
            });
            await fetchCart();
            setSelectedItemIds([]);
        } catch (error) {
            alert(error?.response?.data?.error || "Cập nhật size thất bại.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
                <p className="mt-2 text-gray-500">Bạn đang có {cartItems.length} món trong giỏ.</p>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_0.75fr]">
                    <section className="space-y-5">
                        {cartItems.map((item) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                isSelected={selectedItemIds.includes(item.id)}
                                onSelect={handleSelectItem}
                                onRemove={handleRemoveItem}
                                onIncrease={(selectedItem) => handleUpdateQuantity(selectedItem, "increase")}
                                onDecrease={(selectedItem) => handleUpdateQuantity(selectedItem, "decrease")}
                                onChangeSize={handleChangeSize}
                            />
                        ))}
                    </section>

                    <aside className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900">Tóm tắt đơn hàng</h2>

                        <div className="mt-5">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">Sản phẩm được tính tiền</p>
                                <span className="text-sm text-gray-500">
                                    {selectedItemIds.length === 0 ? "Tất cả" : `${chargedItems.length} món`}
                                </span>
                            </div>

                            <div className="mt-3 space-y-2">
                                {chargedItems.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-3 text-sm">
                                        <span className="line-clamp-1 font-medium text-green-700">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="shrink-0 font-semibold text-green-700">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 space-y-3 text-gray-600">
                            <div className="flex justify-between">
                                <span>Tạm tính</span>
                                <span>{formatPrice(subTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá (10%)</span>
                                <span className="text-red-500">-{formatPrice(discount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span className="text-green-600">Miễn phí</span>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <div className="flex items-end justify-between">
                                <span className="text-lg font-medium text-gray-800">Tổng cộng</span>
                                <span className="text-4xl font-bold text-blue-600">{formatPrice(total)}</span>
                            </div>
                            <button
                                type="button"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-white transition hover:bg-blue-700"
                            >
                                Tiến hành thanh toán
                                <FaShoppingCart size={14} />
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
