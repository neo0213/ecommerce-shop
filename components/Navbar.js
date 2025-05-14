import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useUser();
  const router = useRouter();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [dark, setDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-orange-500 dark:bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow">
      <div className="font-bold text-xl">
        <Link href={user ? "/" : "/login"}>Shop</Link>
      </div>
      <div className="flex gap-6 items-center">
        {user ? (
          <>
            {user.username !== 'admin' && (
              <>
                <Link href="/">Home</Link>
                <Link href="/cart">
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1 bg-white text-orange-500 rounded-full px-2 text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {user.username === 'admin' && (
              <Link href="/admin" className="text-yellow-300 hover:text-yellow-200">
                Admin
              </Link>
            )}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:text-orange-200"
              >
                <span>{user.username}</span>
                <span className="text-xs">▼</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
        <button
          onClick={() => setDark((d) => !d)}
          className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? (
            <span role="img" aria-label="Light mode">🌞</span>
          ) : (
            <span role="img" aria-label="Dark mode">🌙</span>
          )}
        </button>
      </div>
    </nav>
  );
} 