import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound,
  User,
  Package,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  const firstName = user?.fullName?.split(" ")[0] ?? "";

  return (
    <div ref={menuRef} className="relative" style={{ isolation: "isolate" }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User account menu"
        className={`flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[var(--color-foreground)] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
          isOpen
            ? "bg-[var(--color-foreground)]/10"
            : "hover:bg-[var(--color-foreground)]/8"
        }`}
      >
        {/* Avatar or Icon */}
        {isAuthenticated && user ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-black text-xs font-black uppercase">
            {firstName.charAt(0)}
          </span>
        ) : (
          <UserRound size={20} strokeWidth={1.7} />
        )}

        {isAuthenticated && firstName && (
          <span className="hidden text-xs font-semibold md:inline-block max-w-[80px] truncate">
            {firstName}
          </span>
        )}

        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`opacity-50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="user-menu-dropdown"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ zIndex: 9999 }}
            className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {isAuthenticated && user ? (
              <>
                {/* User Info Header */}
                <div className="px-4 py-3.5 bg-gradient-to-br from-amber-500/10 to-transparent border-b border-[var(--color-border)]/50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-black text-sm font-black uppercase">
                      {firstName.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--color-foreground)] truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="p-1.5 space-y-0.5">
                  <MenuItem to="/account" icon={<User size={15} />} label="My Account" onClick={close} />
                  <MenuItem to="/account" icon={<Package size={15} />} label="My Orders" onClick={close} />
                  <MenuItem to="/wishlist" icon={<Heart size={15} />} label="Wishlist" onClick={close} />
                  <MenuItem to="/account" icon={<Settings size={15} />} label="Settings" onClick={close} />
                </nav>

                {/* Logout */}
                <div className="p-1.5 pt-0 border-t border-[var(--color-border)]/50 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Guest Header */}
                <div className="px-4 py-3 border-b border-[var(--color-border)]/50">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    My Account
                  </p>
                </div>

                {/* Auth Buttons */}
                <div className="p-2 space-y-1.5">
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--color-foreground)] px-4 py-2.5 text-xs font-bold text-[var(--color-background)] transition-opacity hover:opacity-85"
                  >
                    <LogIn size={14} />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={close}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-foreground)]/6"
                  >
                    <UserPlus size={14} />
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Reusable Menu Item ── */
function MenuItem({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-foreground)]/6 hover:text-amber-500"
    >
      <span className="opacity-60">{icon}</span>
      {label}
    </Link>
  );
}
