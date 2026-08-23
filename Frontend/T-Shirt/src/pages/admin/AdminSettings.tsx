import { useState, useEffect } from "react";
import { Settings, Store, User, Shield, CreditCard, Truck, Percent, Bell, Sliders, Database, Save } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdminSettings, useUpdateAdminSettings } from "../../hooks/useAdminSettings";

const tabs = [
  { id: "store", label: "Store", icon: Store },
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "tax", label: "Tax", icon: Percent },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "orders", label: "Orders", icon: Sliders },
  { id: "system", label: "System", icon: Database },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("store");
  const { data: settingsData } = useAdminSettings();
  const updateSettingsMutation = useUpdateAdminSettings();

  const [form, setForm] = useState<Record<string, string>>({
    store_name: "KRISHNA T-SHIRTS",
    store_email: "support@tshirtstore.com",
    currency: "INR",
    timezone: "Asia/Kolkata",
    low_stock_threshold: "5",
    return_window_days: "7",
    maintenance_mode: "false",
    razorpay_enabled: "true",
    cod_enabled: "true",
    tax_percentage: "12",
  });

  useEffect(() => {
    if (settingsData) {
      setForm((prev) => ({ ...prev, ...settingsData }));
    }
  }, [settingsData]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(form);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
              <Settings size={14} /> SYSTEM CONFIGURATION
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Admin Settings</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-amber-400 shadow-md transition-all shrink-0"
          >
            <Save size={16} /> {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Tabbed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-1 bg-[var(--color-surface)] p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shrink-0">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all text-left ${
                    activeTab === t.id
                      ? "bg-amber-500 text-black shadow-xs"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  <Icon size={16} />
                  <span>{t.label} Settings</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Body */}
          <div className="lg:col-span-9 p-8 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            {activeTab === "store" && (
              <div className="space-y-4 text-xs font-bold">
                <h3 className="text-base font-black border-b border-slate-200 dark:border-slate-800 pb-3">Store Details</h3>
                <div>
                  <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Store Name</label>
                  <input
                    type="text"
                    value={form.store_name || ""}
                    onChange={(e) => handleChange("store_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Support Email</label>
                  <input
                    type="email"
                    value={form.store_email || ""}
                    onChange={(e) => handleChange("store_email", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Currency</label>
                    <input
                      type="text"
                      value={form.currency || "INR"}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Timezone</label>
                    <input
                      type="text"
                      value={form.timezone || "Asia/Kolkata"}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-4 text-xs font-bold">
                <h3 className="text-base font-black border-b border-slate-200 dark:border-slate-800 pb-3">Payment Gateway Configurations</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-background)]">
                  <div>
                    <p className="font-extrabold text-sm">Razorpay Integration</p>
                    <p className="text-[11px] text-[var(--color-muted)]">Enable UPI, Cards, Net Banking payments</p>
                  </div>
                  <select
                    value={form.razorpay_enabled || "true"}
                    onChange={(e) => handleChange("razorpay_enabled", e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-slate-300 dark:border-slate-700"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-background)]">
                  <div>
                    <p className="font-extrabold text-sm">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-[var(--color-muted)]">Allow customers to pay cash upon doorstep delivery</p>
                  </div>
                  <select
                    value={form.cod_enabled || "true"}
                    onChange={(e) => handleChange("cod_enabled", e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-slate-300 dark:border-slate-700"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-4 text-xs font-bold">
                <h3 className="text-base font-black border-b border-slate-200 dark:border-slate-800 pb-3">System & Maintenance Mode</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-background)] border border-red-500/30">
                  <div>
                    <p className="font-extrabold text-sm text-red-500">Maintenance Mode</p>
                    <p className="text-[11px] text-[var(--color-muted)]">Temporarily lock public storefront for maintenance</p>
                  </div>
                  <select
                    value={form.maintenance_mode || "false"}
                    onChange={(e) => handleChange("maintenance_mode", e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-slate-300 dark:border-slate-700 text-red-500 font-extrabold"
                  >
                    <option value="false">OFF (Store Online)</option>
                    <option value="true">ON (Maintenance Mode)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab !== "store" && activeTab !== "payments" && activeTab !== "system" && (
              <div className="space-y-4 text-xs font-bold">
                <h3 className="text-base font-black border-b border-slate-200 dark:border-slate-800 pb-3 uppercase">
                  {activeTab} Settings
                </h3>
                <p className="text-[var(--color-muted)]">
                  Configurations for {activeTab} are active with default system parameters. Adjust settings above and click Save.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
