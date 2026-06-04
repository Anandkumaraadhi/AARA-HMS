import { useState, FormEvent, ChangeEvent } from "react";
import {
  Settings,
  Building,
  ShieldAlert,
  Bell,
  CheckCircle,
  Save,
} from "lucide-react";

type SettingsForm = {
  clinicName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  timezone: string;
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  twoFactorAuth: boolean;
};

const initialSettings: SettingsForm = {
  clinicName: "AARA Multi-specialty Dental Clinic",
  email: "contact@aarahms.com",
  phone: "+91 9876543210",
  address: "Block A, Prestige Tech Park, Outer Ring Road, Bangalore, India",
  currency: "INR (₹)",
  taxRate: 5,
  timezone: "Asia/Kolkata (GMT+05:30)",
  enableNotifications: true,
  enableEmailAlerts: true,
  twoFactorAuth: false,
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(initialSettings);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const isCheckbox = type === "checkbox";

    setForm((current) => ({
      ...current,
      [name]: isCheckbox
        ? (event.target as HTMLInputElement).checked
        : name === "taxRate"
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMsg("Settings updated successfully!");
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Preferences & Settings
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            System & Clinic Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure clinic demographics, system default metrics, and authentication.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 text-sm font-semibold transition animate-fade-in">
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col - Clinic Profile Settings */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Building size={18} className="text-emerald-600" />
            Clinic Demographics
          </h2>

          <div className="space-y-4">
            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-gray-700">
                Hospital/Clinic Name <span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="clinicName"
                value={form.clinicName}
                onChange={handleInputChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1.5 block">
                <span className="text-xs font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-xs font-semibold text-gray-700">
                  Contact Phone Number <span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                />
              </label>
            </div>

            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-gray-700">
                Clinic Address <span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>
          </div>

          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 pt-3 flex items-center gap-2">
            <Settings size={18} className="text-emerald-600" />
            System Default Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-gray-700">
                Currency Symbol <span className="text-red-500">*</span>
              </span>
              <select
                required
                name="currency"
                value={form.currency}
                onChange={handleInputChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </label>

            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-gray-700">
                Default Service Tax Rate (%) <span className="text-red-500">*</span>
              </span>
              <input
                required
                type="number"
                name="taxRate"
                value={form.taxRate}
                onChange={handleInputChange}
                min="0"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </label>

            <label className="space-y-1.5 block">
              <span className="text-xs font-semibold text-gray-700">
                System Timezone <span className="text-red-500">*</span>
              </span>
              <select
                required
                name="timezone"
                value={form.timezone}
                onChange={handleInputChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                <option value="Asia/Kolkata (GMT+05:30)">Asia/Kolkata (GMT+05:30)</option>
                <option value="UTC (GMT+00:00)">UTC (GMT+00:00)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Right Col - User Preferences & Security */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Bell size={18} className="text-emerald-600" />
                Alerts & Notifications
              </h2>
              <div className="space-y-4 mt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">In-App Notifications</p>
                    <p className="text-xs text-gray-400">Enable dashboard toast alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={form.enableNotifications}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-400 h-5 w-5"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">Email Dispatch Alerts</p>
                    <p className="text-xs text-gray-400">Automated invoices via email</p>
                  </div>
                  <input
                    type="checkbox"
                    name="enableEmailAlerts"
                    checked={form.enableEmailAlerts}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-400 h-5 w-5"
                  />
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShieldAlert size={18} className="text-emerald-600" />
                Security Defaults
              </h2>
              <div className="space-y-4 mt-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">Two-Factor Auth (2FA)</p>
                    <p className="text-xs text-gray-400">Strong user session safety</p>
                  </div>
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={form.twoFactorAuth}
                    onChange={handleInputChange}
                    className="rounded text-emerald-600 focus:ring-emerald-400 h-5 w-5"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <button
              type="submit"
              className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
            >
              <Save size={18} />
              Save Configurations
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
