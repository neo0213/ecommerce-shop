import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function ThankYou() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when the thank you page loads
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <span role="img" aria-label="Thank you" className="text-6xl">🎉</span>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Thank You for Your Purchase!</h1>
      <p className="text-gray-700 dark:text-gray-200 mb-8">
        Your order has been received. We appreciate your business!
      </p>
      <Link href="/">
        <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
} 