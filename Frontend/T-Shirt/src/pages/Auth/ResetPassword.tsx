import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import OTPInput from "../../components/auth/OTPInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { validatePassword } from "../../utils/validation";
import { authService } from "../../services/authService";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = (location.state as { email?: string })?.email || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    otp?: string | null;
    newPassword?: string | null;
    confirmPassword?: string | null;
    general?: string | null;
  }>({});

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = otp.join("");
    const otpErr = code.length < 6 ? "Please enter the 6-digit OTP code." : null;
    const passErr = validatePassword(newPassword);
    const confirmErr = newPassword !== confirmPassword ? "Passwords do not match." : null;

    if (otpErr || passErr || confirmErr) {
      setErrors({
        otp: otpErr,
        newPassword: passErr,
        confirmPassword: confirmErr,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp: code,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password. Try again.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc="/auth/login.jpg" imageAlt="Reset Password">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthHeader
          eyebrow="NEW CREDENTIALS"
          title="Reset Password"
          subtitle="Enter the 6-digit OTP code and choose your new strong password."
        />

        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
            {errors.general}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-500">
            <CheckCircle2 size={16} />
            <span>Password updated successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Verification Code (OTP)
            </label>
            <OTPInput value={otp} onChange={setOtp} />
            {errors.otp && <p className="mt-2 text-xs text-red-500 font-medium">{errors.otp}</p>}
          </div>

          <PasswordInput
            label="New Password"
            placeholder="Enter new strong password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <AuthButton type="submit" loading={loading}>
            Update Password
          </AuthButton>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
          <Link to="/login" className="font-bold text-[var(--color-foreground)] underline underline-offset-4">
            Cancel and Back to Login
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
