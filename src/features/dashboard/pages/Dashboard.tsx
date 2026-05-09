import {
  Users,
  Calendar,
  DollarSign,
  BedDouble,
  BrainCircuit,
  UserRound,
  Clock3,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
/* =========================================
   DATA
========================================= */

const revenueData = [
  {
    date: "01 May",
    revenue: 42000,
  },
  {
    date: "02 May",
    revenue: 51000,
  },
  {
    date: "03 May",
    revenue: 48000,
  },
  {
    date: "04 May",
    revenue: 70000,
  },
  {
    date: "05 May",
    revenue: 86000,
  },
  {
    date: "06 May",
    revenue: 94000,
  },
  {
    date: "07 May",
    revenue: 88000,
  },
];

const patientData = [
  { day: "Mon", patients: 40 },
  { day: "Tue", patients: 55 },
  { day: "Wed", patients: 68 },
  { day: "Thu", patients: 44 },
  { day: "Fri", patients: 78 },
  { day: "Sat", patients: 92 },
];

const departmentData = [
  { name: "Cardiology", value: 35 },
  { name: "Dental", value: 20 },
  { name: "Neurology", value: 25 },
  { name: "Orthopedic", value: 20 },
];

const appointments = [
  {
    id: "#PT1001",
    name: "Rahul Sharma",
    doctor: "Dr. Mehta",
    department: "Cardiology",
    date: "09 May 2026",
    status: "Completed",
  },
  {
    id: "#PT1002",
    name: "Priya Reddy",
    doctor: "Dr. Kumar",
    department: "Dental",
    date: "09 May 2026",
    status: "In Progress",
  },
  {
    id: "#PT1003",
    name: "Anjali Verma",
    doctor: "Dr. Singh",
    department: "Neurology",
    date: "09 May 2026",
    status: "Pending",
  },
];

const COLORS = ["#2563EB", "#7C3AED", "#14B8A6", "#F97316"];

/* =========================================
   COMPONENT
========================================= */

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_30%),radial-gradient(circle_at_bottom_right,_#ede9fe,_transparent_30%),#f8fafc]">


      {/* ================= CONTENT ================= */}
      <div className="p-6 space-y-6">

        {/* ================= TOP SECTION ================= */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Hospital Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Welcome back 👋 Here’s today’s hospital overview
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 bg-white rounded-2xl shadow-sm  hover:shadow-md transition flex items-center gap-2">
              <Download size={18} className="text-emerald-600" />
              <span className="font-medium text-gray-700">
                Export Report
              </span>
            </button>

            <button className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg hover:scale-[1.02] transition">
              + Add Patient
            </button>

          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {[
            {
              title: "Today's Total Patients",
              value: "12,845",
              icon: Users,
              color: "from-emerald-400 to-green-500",
              growth: "+18%",
            },
            {
              title: "Today's Appointments",
              value: "1,245",
              icon: Calendar,
              color: "from-teal-400 to-emerald-500",
              growth: "+12%",
            },
            {
              title: "Today's Revenue",
              value: "₹8.4L",
              icon: DollarSign,
              color: "from-emerald-500 to-green-600",
              growth: "+24%",
            },
            {
              title: "Today's Available Beds",
              value: "124",
              icon: BedDouble,
              color: "from-lime-400 to-green-500",
              growth: "-5%",
            },
          ].map((card, i) => {
            const Icon = card.icon;

            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl p-5 hover:-translate-y-1 transition-all duration-300"
              >

                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.color}`}></div>

                <div className="relative flex justify-between items-start">

                  <div>

                    <p className="text-sm text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-gray-900">
                      {card.value}
                    </h2>

                    <div className="flex items-center gap-1 mt-4">

                      {card.growth.includes("-") ? (
                        <ArrowDownRight
                          className="text-red-500"
                          size={16}
                        />
                      ) : (
                        <ArrowUpRight
                          className="text-green-500"
                          size={16}
                        />
                      )}

                      <span
                        className={`text-sm font-medium ${card.growth.includes("-")
                          ? "text-red-500"
                          : "text-green-500"
                          }`}
                      >
                        {card.growth}
                      </span>

                    </div>
                  </div>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>

                </div>

                {/* MINI GRAPH */}
                <div className="mt-5 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${card.color} w-[75%] rounded-full`}
                  />
                </div>

              </div>
            );
          })}
        </div>
        {/* ================= PREMIUM TABLE ================= */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Latest Appointments
              </h2>

              <p className="text-sm text-gray-500">
                Recent patient activities
              </p>
            </div>

            <button className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm">
              View All
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50/80">

                <tr className="text-left">

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Department
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {appointments.map((item, i) => (

                  <tr
                    key={i}
                    className="border-t border-gray-100 hover:bg-emerald-50/40 transition"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                          <UserRound size={20} />
                        </div>

                        <div>

                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.id}
                          </p>

                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {item.doctor}
                    </td>

                    <td className="px-6 py-5 text-gray-700">
                      {item.department}
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock3 size={16} />
                        {item.date}
                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`px-4 py-2 rounded-full text-xs font-semibold ${item.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Pending"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-purple-100 text-purple-600"
                          }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>
            </table>
          </div>
        </div>
        {/* ================= ANALYTICS ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* REVENUE */}
          <div className="xl:col-span-2 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl p-6">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Revenue Analytics
                </h2>

                <p className="text-sm text-gray-500">
                  Monthly hospital revenue growth
                </p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm">
                This Year
              </button>

            </div>

            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>

                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [`₹${value}`, "Revenue"]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={4}
                  />

                </AreaChart>
              </ResponsiveContainer>

            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="rounded-3xl text-black shadow-2xl p-6 relative overflow-hidden">

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>

            <div className="relative">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                  <BrainCircuit size={28} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    AI Insights
                  </h2>

                  <p className="text-black text-sm">
                    Smart hospital analytics
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {[
                  "OPD increased by 18% this week",
                  "ICU occupancy nearing 92%",
                  "AI detected unusual patient spike",
                  "Revenue expected to grow 12%",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                  >
                    <p className="text-sm leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* PATIENT FLOW */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl p-6">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Patient Flow
              </h2>

              <p className="text-sm text-gray-500">
                Daily patient visits
              </p>
            </div>

            <div className="h-72">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientData}>

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="patients"
                    fill="#7C3AED"
                    radius={[10, 10, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>

          {/* DEPARTMENTS */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl p-6">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Departments
              </h2>

              <p className="text-sm text-gray-500">
                Department contribution
              </p>
            </div>

            <div className="h-72">

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={departmentData}
                    dataKey="value"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                  >
                    {departmentData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>


      </div>
    </div>
  );
}