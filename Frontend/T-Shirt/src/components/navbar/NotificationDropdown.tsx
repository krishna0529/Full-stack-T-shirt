import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Package, CreditCard, Truck, Star, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from "../../hooks/useNotifications";
import type { NotificationType } from "../../types/notification";
import { useAuthStore } from "../../store/authStore";

export function NotificationDropdown() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useUnreadCount();
  const { data: notificationsPage } = useNotifications(0, 5);
  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();

  const unreadCount = unreadData?.unreadCount || 0;
  const notifications = notificationsPage?.content || [];

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isAuthenticated) return null;

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "ORDER_CREATED":
      case "ORDER_CONFIRMED":
        return <Package size={14} className="text-amber-500" />;
      case "PAYMENT_SUCCESS":
      case "PAYMENT_FAILED":
        return <CreditCard size={14} className="text-emerald-500" />;
      case "ORDER_SHIPPED":
      case "OUT_FOR_DELIVERY":
      case "ORDER_DELIVERED":
        return <Truck size={14} className="text-blue-500" />;
      case "REVIEW_REMINDER":
      case "NEW_REVIEW":
        return <Star size={14} className="text-purple-500" />;
      default:
        return <Sparkles size={14} className="text-amber-500" />;
    }
  };

  const handleNotificationClick = (id: number, refType?: string | null, refId?: number | null) => {
    markAsReadMutation.mutate(id);
    setIsOpen(false);

    if (refType === "ORDER" && refId) {
      navigate(`/account/orders`);
    } else if (refType === "PRODUCT" && refId) {
      navigate(`/products/${refId}`);
    } else {
      navigate("/account/notifications");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 rounded-xl text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-all focus:outline-hidden"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-black text-black bg-amber-500 rounded-full shadow-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-xs"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-[var(--color-background)]">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-amber-500" />
                <h4 className="font-extrabold text-[var(--color-foreground)] text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllMutation.mutate()}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:underline"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell size={24} className="mx-auto text-slate-400 opacity-40" />
                  <p className="font-bold text-[var(--color-foreground)]">No notifications yet</p>
                  <p className="text-[11px] text-[var(--color-muted)]">We'll notify you about your orders and delivery updates.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.referenceType, n.referenceId)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                      !n.read
                        ? "bg-amber-500/5 hover:bg-amber-500/10"
                        : "hover:bg-[var(--color-background)] opacity-80"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 shrink-0">
                      {getTypeIcon(n.type)}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className={`font-bold ${!n.read ? "text-[var(--color-foreground)]" : "text-[var(--color-muted)]"}`}>
                          {n.title}
                        </p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] font-mono text-slate-400 pt-1">
                        {new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-[var(--color-background)] text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/account/notifications");
                }}
                className="inline-flex items-center gap-1 font-extrabold text-xs text-[var(--color-foreground)] hover:text-amber-500 transition-colors"
              >
                View all notifications <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;
