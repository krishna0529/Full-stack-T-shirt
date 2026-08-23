import { useState, useEffect } from "react";
import { User, Check } from "lucide-react";
import { useCustomerProfile, useUpdateCustomerProfile } from "../../hooks/useProfile";

export default function ProfileForm() {
  const { data: profile, isLoading } = useCustomerProfile();
  const updateMutation = useUpdateCustomerProfile();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
      setProfileImageUrl(profile.profileImageUrl || "");
      setDateOfBirth(profile.dateOfBirth || "");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    updateMutation.mutate(
      {
        fullName,
        phone: phone || undefined,
        profileImageUrl: profileImageUrl || undefined,
        dateOfBirth: dateOfBirth || undefined,
      },
      {
        onSuccess: () => {
          setSuccessMsg("Profile details updated successfully!");
          setTimeout(() => setSuccessMsg(""), 4000);
        },
      }
    );
  };

  if (isLoading) {
    return <div className="p-6 text-center text-xs text-[var(--color-muted)] animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-base font-extrabold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-2">
          <User className="w-5 h-5 text-amber-500" /> PERSONAL PROFILE INFO
        </h2>
        <p className="text-xs text-[var(--color-muted)]">
          Update your contact information and personal account details.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-xs flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl text-xs">
        <div>
          <label className="block font-bold text-[var(--color-muted)] mb-1">Account Email (Immutable)</label>
          <input
            type="email"
            value={profile?.email || ""}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400 font-semibold cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-bold text-[var(--color-muted)] mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-bold text-[var(--color-muted)] mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-bold text-[var(--color-muted)] mb-1">Profile Avatar URL (Optional)</label>
          <input
            type="text"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block font-bold text-[var(--color-muted)] mb-1">Date of Birth (Optional)</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold uppercase text-xs hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all"
          >
            {updateMutation.isPending ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
