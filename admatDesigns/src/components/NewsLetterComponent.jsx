import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const NewsLetterComponent = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return;
  }

    try {
      setLoading(true);

      const response = await axios.post(
      `${API_BASE_URL}/newsletter/`,
        {
          email,
        }
      );

      toast.success(
        response.data.success || response.data.message
      );

      setEmail("")

    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Subscription failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-100 rounded-xl lg:max-w-6xl w-full lg:mx-auto py-10 px-4">
      <section className="flex flex-col items-center">

        <div className="flex flex-col items-center">
          <h2 className="text-center text-4xl font-semibold max-w-2xl text-black">
            Subscribe to our{" "}
            <span className="text-orange-600">
              newsletter
            </span>
          </h2>

          <p className="text-center text-slate-500 max-w-lg mt-3">
            Be the first to know about new arrivals,
            exclusive discounts, furniture inspiration,
            and limited-time offers from Footer Furniture.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-center my-10 border border-orange-600 rounded p-2 max-w-xl w-full">

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubscribe();
              }
            }}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none px-4 h-11"
          />

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full lg:min-w-[180px] lg:w-auto rounded bg-orange-600 text-white h-11 px-5 flex items-center justify-center gap-2 transition hover:from-orange-700 hover:to-orange-900 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewsLetterComponent;