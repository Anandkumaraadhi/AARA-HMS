import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  HeartPulse,

  Building2
} from "lucide-react";

export default function Login() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [hospitalCode, setHospitalCode] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // MOCK LOGIN
    const fakeUser = {
      id: "1",
      name: "Admin",
      role: "admin",
      clinicId: "clinic_001",
    };

    const fakeToken = "mock-token";

    setAuth(fakeUser, fakeToken);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] overflow-hidden">

      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#e8fff4] via-[#dffcf2] to-[#ccfbf1]">

        {/* SOFT GLOW EFFECTS */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="w-14 h-14 rounded-2xl bg-white/70 backdrop-blur-xl flex items-center justify-center border border-emerald-100 shadow-lg">

              <HeartPulse
                size={30}
                className="text-emerald-600"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-wide text-gray-900">
                AARA HMS
              </h1>

              <p className="text-emerald-700 text-sm font-medium">
                AI Powered Hospital Software Platform
              </p>

            </div>

          </div>

          {/* CENTER TEXT */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 bg-white/60 border border-emerald-100 px-4 py-2 rounded-full backdrop-blur-xl mb-6 shadow-sm">

              <ShieldCheck
                size={18}
                className="text-emerald-600"
              />

              <span className="text-sm text-emerald-700 font-medium">
                Secure Healthcare Management
              </span>

            </div>

            <h2 className="text-5xl font-bold leading-tight mb-6 text-gray-900">

              Modern AI Driven Hospital Management System

            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">

              Manage patients, doctors, appointments, billing,
              EMR, laboratory reports, and AI-powered analytics
              from one intelligent healthcare platform.

            </p>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4">

            {[
              {
                title: "Patients",
                value: "12K+",
              },
              {
                title: "Doctors",
                value: "250+",
              },
              {
                title: "Clinics",
                value: "48+",
              },
            ].map((item, i) => (

              <div
                key={i}
                className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >

                <h3 className="text-3xl font-bold text-gray-900">
                  {item.value}
                </h3>

                <p className="text-emerald-700 mt-1 text-sm font-medium">
                  {item.title}
                </p>

              </div>

            ))}

          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">

        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-200/40">
              <HeartPulse size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AARA HMS
              </h1>

              <p className="text-sm text-gray-500">
                Smart Hospital Platform
              </p>
            </div>

          </div>

          {/* LOGIN CARD */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">

            {/* TOP */}
            <div className="mb-8">

              <h2 className="text-3xl font-bold text-gray-900">
                Welcome Back 👋
              </h2>

              <p className="text-gray-500 mt-2">
                Login to access your hospital dashboard
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="admin@hospital.com"
                    className="w-full h-14 rounded-2xl border border-gray-200 bg-white/80 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                </div>
              </div>



              <div>

                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Hospital Code
                </label>

                <div className="relative">

                  <Building2
                    size={18}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="VVH"
                    className="
                        w-full
                        h-14
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white/80
                        backdrop-blur-xl
                        pl-12
                        pr-4
                        outline-none
                        transition-all
                        duration-300
                        focus:ring-2
                        focus:ring-blue-500
                        focus:border-blue-500
                        hover:border-blue-300
                      "
                    value={hospitalCode}
                    onChange={(e) => setHospitalCode(e.target.value)}

                  />

                </div>

              </div>

              {/* PASSWORD */}
              <div>

                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full h-14 rounded-2xl border border-gray-200 bg-white/80 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">

                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />

                  Remember me

                </label>

                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </button>

              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="
    w-full
    h-14
    rounded-2xl
    bg-gradient-to-r
    from-emerald-400
    via-green-500
    to-teal-500
    text-white
    font-semibold
    shadow-lg
    hover:shadow-emerald-200/50
    hover:scale-[1.01]
    transition-all
    duration-300
  "
              >
                Login to Dashboard
              </button>

            </form>

            {/* FOOTER */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">

              <p className="text-sm text-gray-500">
                © 2026 AARA HMS — AI Healthcare Platform
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}