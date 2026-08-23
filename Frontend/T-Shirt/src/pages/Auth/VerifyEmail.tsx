import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import OTPInput from "../../components/auth/OTPInput";
import AuthButton from "../../components/auth/AuthButton";
import { authService } from "../../services/authService";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state as { email?: string })?.email || "your email";
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authService.verifyEmail({ email, otp: code });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to verify. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(30);
      setError(null);
    }
  };

  return (
    <AuthLayout imageSrc="/auth/login.jpg" imageAlt="Verify Email">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthHeader
          eyebrow="EMAIL VERIFICATION"
          title="Verify Email"
          subtitle={`We have sent a 6-digit verification code to ${email}.`}
        />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-500">
            <CheckCircle2 size={16} />
            <span>Email verified successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-8">
          <OTPInput value={otp} onChange={setOtp} />

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] disabled:opacity-50 transition-colors"
            >
              {countdown > 0 ? `Resend Code in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          <AuthButton type="submit" loading={loading}>
            Verify & Activate
          </AuthButton>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
          Need to change email?{" "}
          <Link to="/register" className="font-bold text-[var(--color-foreground)] underline">
            Back to Register
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
