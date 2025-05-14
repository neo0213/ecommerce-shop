import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

export default function ThankYou() {
  const { clearCart } = useCart();
  const { user, updateUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Clear the cart when the thank you page loads
    clearCart();
    // Update user stats after purchase
    if (user) {
      const prevPurchases = Number(user.numberOfPurchases) || 0;
      const updatedFields = {
        numberOfPurchases: prevPurchases + 1,
        purchaseStatus: 1,
        productCategory: Math.floor(Math.random() * 5),
        sessionTime: user.sessionTime || 0,
        loyaltyProgram: user.isLoyal ? 1 : 0,
      };
      updateUser(updatedFields);
    }
  }, []); // Only run once on mount

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <span role="img" aria-label="Thank you" className="text-6xl">🎉</span>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Thank You for Your Purchase!</h1>
      <p className="text-gray-700 dark:text-gray-200 mb-8">
        Your order has been received. We appreciate your business!
      </p>
      <button
        className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
        onClick={() => router.push("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
} 