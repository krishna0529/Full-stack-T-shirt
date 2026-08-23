import { useState } from "react";
import { Bell, CheckCheck, Package, CreditCard, Truck, Star, Sparkles } from "lucide-react";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from "../../hooks/useNotifications";
import type { NotificationResponse, NotificationType } from "../../types/notification";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const { data: pageData, isLoading, isError, refetch } = useNotifications(0, 50);
  const { data: unreadData } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();

  const allNotifications = pageData?.content || [];
  const filtered = filter === "UNREAD" ? allNotifications.filter((n) => !n.read) : allNotifications;
  const unreadCount = unreadData?.unreadCount || 0;

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "ORDER_CREATED":
      case "ORDER_CONFIRMED":
        return <Package className="w-4 h-4 text-amber-500" />;
      case "PAYMENT_SUCCESS":
      case "PAYMENT_FAILED":
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case "ORDER_SHIPPED":
      case "OUT_FOR_DELIVERY":
      case "ORDER_DELIVERED":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "REVIEW_REMINDER":
      case "NEW_REVIEW":
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleNotificationClick = (n: NotificationResponse) => {
    if (!n.read) {
      markAsReadMutation.mutate(n.id);
    }
    if (n.referenceType === "ORDER" && n.referenceId) {
      navigate(`/account/orders`);
    } else if (n.referenceType === "PRODUCT" && n.referenceId) {
      navigate(`/products/${n.referenceId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> NOTIFICATIONS
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Stay updated with your order statuses, payments, and shipping alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex bg-[var(--color-surface)] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === "ALL"
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-xs"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
            >
              All ({allNotifications.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === "UNREAD"
                  ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-xs"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-xs"
            >
              <CheckCheck size={14} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse flex gap-4 items-center">
              <div className="w-10 h-10 bg-slate-300 dark:bg-slate-800 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-sm w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-3">
          <p className="text-sm font-bold text-red-500">Failed to load notifications.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-wider"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Bell className="w-10 h-10 mx-auto text-amber-400 opacity-50" />
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">You're all caught up!</h3>
          <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
            {filter === "UNREAD"
              ? "No unread notifications right now."
              : "No new notifications found in your account history."}
          </p>
        </div>
      )}

      {/* Notifications List */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? "bg-amber-500/5 border-amber-500/30 shadow-xs"
                  : "bg-[var(--color-surface)] border-slate-200 dark:border-slate-800 opacity-85 hover:border-slate-400 dark:hover:border-slate-700"
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 shrink-0">
                {getTypeIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-extrabold ${!n.read ? "text-[var(--color-foreground)]" : "text-[var(--color-muted)]"}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-foreground)] opacity-90 leading-relaxed font-normal">
                  {n.message}
                </p>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
