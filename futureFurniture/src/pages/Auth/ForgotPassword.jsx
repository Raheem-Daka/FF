import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "sonner";
import { apiFetch } from "../../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await apiFetch("/forgot-password/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      toast.success(
        "A reset link has been sent to this email, please check your email."
      );
    } catch (err) {
      toast.error(err?.message || "Unable to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center text-sm items-center min-h-[70vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6"
      >
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Enter your email address and we'll send you a password reset link.
        </p>

        <div className="mt-6 flex items-center h-12 border border-orange-300 rounded px-4 focus-within:border-orange-600">
          <FaEnvelope className="text-orange-600" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full ml-3 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded bg-gradient-to-b from-orange-600 to-orange-800 text-white hover:from-orange-700 hover:to-orange-900 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center mt-4">
          <Link
            to="/signin"
            className="text-orange-600 hover:underline text-sm"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;