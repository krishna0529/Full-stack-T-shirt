import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { validateEmail } from "../../utils/validation";
import { authService } from "../../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authService.sendForgotPasswordOTP(email);
      navigate("/reset-password", { state: { email } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset code. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc="/auth/login.jpg" imageAlt="Forgot Password">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthHeader
          eyebrow="RECOVER ACCOUNT"
          title="Forgot Password"
          subtitle="Enter the email address associated with your account and we will send you a 6-digit reset code."
        />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />

          <AuthButton type="submit" loading={loading}>
            Send Reset Code
          </AuthButton>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
          Remembered your password?{" "}
          <Link to="/login" className="font-bold text-[var(--color-foreground)] underline underline-offset-4">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
