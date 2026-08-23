import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { validateEmail, validatePassword } from "../../utils/validation";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useGuestCart } from "../../store/guestCartStore";
import { cartService } from "../../services/cartService";

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null; general?: string | null }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const user = {
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      };
      loginStore(user, response.accessToken);

      // Merge Guest Cart items if any exist
      const guestItems = useGuestCart.getState().items;
      if (guestItems.length > 0) {
        try {
          const mergePayload = guestItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          }));
          await cartService.mergeGuestCart(mergePayload);
          useGuestCart.getState().clearCart();
        } catch (mergeErr) {
          console.warn("Failed to merge guest cart", mergeErr);
        }
      }

      if (response.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to login. Please try again.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc="/auth/login.jpg" imageAlt="Login Fashion">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthHeader
          eyebrow="WELCOME BACK"
          title="Login"
          subtitle="Sign in to access your account, track orders, and manage your wishlist."
        />

        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div>
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="mt-3 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] underline underline-offset-4 hover:text-[var(--color-foreground)] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <AuthButton type="submit" loading={loading}>
            Sign In
          </AuthButton>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[var(--color-foreground)] underline underline-offset-4"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
