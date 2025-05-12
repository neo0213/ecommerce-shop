import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-4 flex flex-col items-center animate-pulse min-h-[350px]" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-300">No products found.</div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col items-center group"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain mb-4 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
              />
              <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white text-center line-clamp-2 min-h-[3rem]">{product.title}</h2>
              <p className="text-orange-500 dark:text-orange-300 font-bold mb-2 text-lg">₱{product.price.toLocaleString()}</p>
              <Link
                href={`/product/${product.id}`}
                className="mt-auto w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                View Product
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 