import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import placeHolder from "../../assets/placeholder.png";
import { RiDeleteBin6Line } from "react-icons/ri";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const resolveImageUrl = (url) => {
  if (!url) return "/placeholder.png";

  const base = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  return url.startsWith("http")
    ? url
    : `${base}${url}`;
};

const Cart = () => {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart().finally(() => 
      setTimeout(() =>
      setLoading(false)
      , 1000)
    );
  }, []);

  // ✅ PRODUCT ID (item.id)
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    setUpdating(itemId);

    try {
      await apiFetch(`/cart/items/${itemId}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  // ✅ PRODUCT ID (item.id)
  const removeItem = async (itemId) => {

    setUpdating(itemId);

    try {
      await apiFetch(`/cart/items/${itemId}/delete/`, {
        method: "DELETE",
      });
      fetchCart();
    } finally {
      setUpdating(null);
    }
  };

  const formatMWK = (value) =>
    Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-500">Loading cart items...</p>
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return <div className="p-6 h-screen text-center flex justify-center items-center">Your cart is empty 🛒</div>;
  }

  const total = cart.items.reduce(
    (sum, ci) => sum + Number(ci.item.current_price) * ci.quantity,
    0
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        <div className="space-y-4">
          {cart.items.map((ci) => (
            <div
              key={ci.id}
              className="flex flex-col justify-between sm:flex-row gap-4 sm:items-center border border-gray-300 rounded-lg p-4"
            >
              {/* ✅ Image */}
              <div className="flex lg:flex-row flex-grow justify-between gap-x-4">
                <img
                  src={resolveImageUrl(
                    ci.item.imageUrl ||
                      (ci.item.images?.length
                        ? ci.item.images[0].imageUrl
                        : placeHolder)
                  )}
                  alt={ci.item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* Name and Price */}
                <div className="flex-1 ">
                  <h2 className="font-semibold">{ci.item.name}</h2>

                  <div className="text-gray-500 truncate ">
                    {ci.item.description && (
                      <ul className="text-xs text-gray-700 list-disc pl-6">
                        {ci.item.description
                          .split(/\n|,/)
                          .slice(0,3)
                          .map((line, i) =>
                            line.trim() ? <li key={i}>{line.trim()}</li> : null
                          )}
                      </ul>
                    )}  
                  </div>

                  {Number(ci.item.current_price) !== Number(ci.item.price) ? (
                    <div className="text-sm">
                      <div className="flex gap-2  font-semibold">
                        <p className="font-semibold text-red-500">was : </p>
                        <p className="text-red-500 line-through">
                          MWK {formatMWK(ci.item.price)}
                        </p>
                      </div>

                      <div className="flex gap-2  font-semibold">
                        <p className="font-semibold text-green-500">Now : </p>
                        <p className="text-green-600">
                          MWK {formatMWK(ci.item.current_price)}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <p className="text-green-600 font-semibold">
                      MWK {formatMWK(ci.item.current_price)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-1 lg:justify-between gap-2">
              {/* ✅ Quantity */}
                <div className="flex items-center gap-2">
                  <button
                  disabled={updating === ci.item.id}
                    onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                    className="px-3 py-1 border border-orange-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>

                  <span className="text-gray-500">{ci.quantity}</span>

                  <button
                  disabled={updating === ci.item.id}
                    onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                    className="px-3 py-1 border border-orange-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                {/* ✅ Remove */}
                <button
                  disabled={updating === ci.item.id}
                  onClick={() => removeItem(ci.item.id)}
                  className="cursor-pointer text-red-600 transition-all duration-200 ease-in-out hover:text-red-700">
                    <RiDeleteBin6Line size={24} />
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* ✅ Total */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-300 pt-6">
          <h2 className="text-xl font-semibold text-gray-500 break-words">
            Total: MWK {formatMWK(total)}
          </h2>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full sm:w-auto rounded bg-orange-600 px-4 py-2 text-orange-100"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;