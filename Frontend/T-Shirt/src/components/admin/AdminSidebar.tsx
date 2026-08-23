import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Tag,
  Truck,
  BarChart3,
  Settings,
  Store,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: Layers },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Shipments", href: "/admin/shipments", icon: Truck },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Admin Portal
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          to="/shop"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Store className="w-5 h-5 text-amber-500" />
          <span>View Customer Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
