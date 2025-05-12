import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => setProduct(data));
    }
  }, [id]);

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <img
          src={product.image}
          alt={product.title}
          className="w-full md:w-1/2 h-64 object-contain rounded-xl bg-gray-50 dark:bg-gray-800"
        />
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{product.title}</h1>
          <p className="text-orange-500 dark:text-orange-300 font-bold text-xl mb-4">₱{product.price.toLocaleString()}</p>
          <p className="mb-4 text-gray-700 dark:text-gray-200">{product.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <label className="text-gray-700 dark:text-gray-200">Qty:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600"
            onClick={() => {
              addToCart(product, quantity);
              router.push("/cart");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 