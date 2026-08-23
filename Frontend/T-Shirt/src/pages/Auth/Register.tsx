import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { validateEmail, validatePassword, validateUsername } from "../../utils/validation";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    fullName?: string | null;
    username?: string | null;
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
    general?: string | null;
  }>({});

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = !fullName.trim() ? "Full name is required." : null;
    const userErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = password !== confirmPassword ? "Passwords do not match." : null;

    if (nameErr || userErr || emailErr || passErr || confirmErr) {
      setErrors({
        fullName: nameErr,
        username: userErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await authService.register({
        fullName,
        email,
        password,
      });

      const user = {
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
      };
      loginStore(user, response.accessToken);
      navigate("/account");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Try again.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout imageSrc="/auth/login.jpg" imageAlt="Register Fashion">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthHeader
          eyebrow="JOIN AGROX"
          title="Create Account"
          subtitle="Register to enjoy exclusive early access drops, order tracking, and member perks."
        />

        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />

          <AuthInput
            label="Username"
            type="text"
            placeholder="johndoe_99"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <div className="pt-2">
            <AuthButton type="submit" loading={loading}>
              Create Account
            </AuthButton>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[var(--color-foreground)] underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
