import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">



      {/* 🔹 Center - Search */}
      <div className="relative w-full max-w-md">

        <Search
          className="absolute left-4 top-3.5 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search patients, doctors, reports..."
          className="w-full bg-white/70 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* 🔹 Right - Actions */}
      <div className="flex items-center gap-4">

        <button className="relative w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center hover:scale-105 transition">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-[1.02] transition">
          {/* <BrainCircuit size={18} /> */}
          AI Assistant
        </button>

        <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-2 shadow-sm">
          <img
            src="https://i.pravatar.cc/40"
            alt=""
            className="w-10 h-10 rounded-xl"
          />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}