import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../../api/api";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      await apiFetch(
        `/reset-password/${uidb64}/${token}/`,
        {
          method: "POST",
          body: JSON.stringify({
            password,
            confirm_password: confirmPassword,
          }),
        }
      );

      toast.success("Password reset successful");
      navigate("/signin", { replace: true });
    } catch (err) {
      toast.error(
        err?.message ||
          "Reset link is invalid or has expired"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border p-6 shadow-sm"
      >
        <h1 className="text-3xl font-semibold text-center">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          Enter your new password below.
        </p>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 outline-none"
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="absolute right-3 top-3"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3 mt-4 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 rounded bg-orange-600 text-white hover:bg-orange-700"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;