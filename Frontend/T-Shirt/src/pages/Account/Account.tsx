import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Heart, Shield, ArrowRight, User, ShoppingBag, MapPin, Bell, RotateCcw } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import OrderHistory from "./OrderHistory";
import ProfileForm from "./ProfileForm";
import AddressBook from "./AddressBook";
import NotificationsPage from "./NotificationsPage";
import ReturnsList from "./ReturnsList";
import { useUnreadCount } from "../../hooks/useNotifications";

type TabType = "ORDERS" | "RETURNS" | "PROFILE" | "ADDRESSES" | "NOTIFICATIONS";

export default function Account() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<TabType>("ORDERS");

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unreadCount || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full pt-28 pb-24 md:pt-36 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 space-y-10">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-[var(--color-border)] gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-muted)]">
              CUSTOMER PORTAL
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">
              Welcome back, {user?.fullName || "Member"}!
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:border-red-500 transition-colors shadow-xs"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "ORDERS"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-[var(--color-muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> My Orders
          </button>

          <button
            onClick={() => setActiveTab("RETURNS")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "RETURNS"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-[var(--color-muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <RotateCcw className="w-4 h-4" /> Returns & Refunds
          </button>

          <button
            onClick={() => setActiveTab("PROFILE")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "PROFILE"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-[var(--color-muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <User className="w-4 h-4" /> Profile Info
          </button>

          <button
            onClick={() => setActiveTab("ADDRESSES")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "ADDRESSES"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-[var(--color-muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MapPin className="w-4 h-4" /> Saved Addresses
          </button>

          <button
            onClick={() => setActiveTab("NOTIFICATIONS")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all relative ${
              activeTab === "NOTIFICATIONS"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "text-[var(--color-muted)] hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-black text-white dark:bg-white dark:text-black">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === "ORDERS" && <OrderHistory />}
          {activeTab === "RETURNS" && <ReturnsList />}
          {activeTab === "PROFILE" && <ProfileForm />}
          {activeTab === "ADDRESSES" && <AddressBook />}
          {activeTab === "NOTIFICATIONS" && <NotificationsPage />}
        </div>

        {/* Quick Links & Wishlist Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={20} className="text-red-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Saved Items</h3>
              </div>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                View saved heavyweight t-shirts and streetwear favorites.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-foreground)]">Wishlist</span>
              <Link to="/wishlist" className="text-xs font-bold underline flex items-center gap-1">
                View Wishlist <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <Shield size={24} className="text-emerald-500 shrink-0" />
            <div>
              <h4 className="font-bold text-[var(--color-foreground)] mb-0.5">Account Security</h4>
              <p>Your session is secured using JWT Authentication token architecture.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
