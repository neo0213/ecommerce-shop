import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import { UserProvider } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  return (
    <UserProvider>
      <CartProvider>
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
          <Navbar />
          {isAuthPage ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </div>
      </CartProvider>
    </UserProvider>
  );
}

export default MyApp; 