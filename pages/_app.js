import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import { UserProvider } from "../context/UserContext";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <CartProvider>
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </CartProvider>
    </UserProvider>
  );
}

export default MyApp; 