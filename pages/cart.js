import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, activateLoyalty } = useUser();
  const router = useRouter();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = user?.isLoyal ? subtotal * 0.2 : 0;
  const total = subtotal - discount;

  const handleCheckout = () => {
    if (!user?.isLoyal) {
      activateLoyalty();
    }
    router.push('/thank-you');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-gray-700 dark:text-gray-200">Your cart is empty. <Link href="/">Go shopping!</Link></div>
      ) : (
        <>
          <ul className="divide-y mb-6">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-4 bg-white dark:bg-gray-900 rounded-xl mb-2 px-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title || item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{item.title || item.name}</div>
                    <div className="text-gray-700 dark:text-gray-200">Qty: {item.quantity}</div>
                    <div className="text-orange-500 dark:text-orange-300 font-bold">₱{item.price.toLocaleString()}</div>
                  </div>
                </div>
                <button
                  className="text-red-500 dark:text-red-300 hover:underline"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-gray-700 dark:text-gray-200">Subtotal:</div>
              <div className="font-bold text-gray-900 dark:text-white">₱{subtotal.toLocaleString()}</div>
            </div>
            {user?.isLoyal && (
              <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                <div>Loyalty Discount (20%):</div>
                <div>-₱{discount.toLocaleString()}</div>
              </div>
            )}
            <div className="flex justify-between items-center border-t pt-2">
              <div className="font-bold text-gray-900 dark:text-white">Total:</div>
              <div className="font-bold text-orange-500 dark:text-orange-300">₱{total.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button className="text-sm text-gray-500 dark:text-gray-300 hover:underline" onClick={clearCart}>
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600"
            >
              Proceed to Checkout
            </button>
          </div>
          {!user?.isLoyal && (
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Complete your first purchase to activate the loyalty program and get 20% off on all future purchases!
            </div>
          )}
        </>
      )}
    </div>
  );
} 