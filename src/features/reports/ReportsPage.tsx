import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  Building,
  Activity,
  ArrowUpRight,
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
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ReportTab = "Financial" | "Operational" | "Patient";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

const financialTrend = [
  { month: "Jan", revenue: 240000, expenses: 180000 },
  { month: "Feb", revenue: 300000, expenses: 200000 },
  { month: "Mar", revenue: 280000, expenses: 190000 },
  { month: "Apr", revenue: 350000, expenses: 220000 },
  { month: "May", revenue: 420000, expenses: 250000 },
];

const occupancyByType = [
  { type: "ICU", occupied: 8, total: 10 },
  { type: "Sharing", occupied: 24, total: 30 },
  { type: "Private", occupied: 12, total: 15 },
  { type: "General", occupied: 45, total: 60 },
];

const patientDistribution = [
  { name: "Active", value: 45 },
  { name: "Discharged", value: 120 },
  { name: "Transferred", value: 15 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("Financial");

  const downloadCSV = (reportType: ReportTab) => {
    let headers = "";
    let rows = "";
    let filename = "";

    if (reportType === "Financial") {
      headers = "Month,Revenue (INR),Expenses (INR)\n";
      rows = financialTrend
        .map((row) => `${row.month},${row.revenue},${row.expenses}`)
        .join("\n");
      filename = "financial_report.csv";
    } else if (reportType === "Operational") {
      headers = "Room Type,Occupied Beds,Total Beds,Occupancy Rate (%)\n";
      rows = occupancyByType
        .map(
          (row) =>
            `${row.type},${row.occupied},${row.total},${(
              (row.occupied / row.total) *
              100
            ).toFixed(1)}`
        )
        .join("\n");
      filename = "operational_occupancy_report.csv";
    } else {
      headers = "Patient Status,Count\n";
      rows = patientDistribution
        .map((row) => `${row.name},${row.value}`)
        .join("\n");
      filename = "patient_distribution_report.csv";
    }

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Analytics & Audits
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            System Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Verify clinic performance, financial growth trends, and department workloads.
          </p>
        </div>

        <button
          type="button"
          onClick={() => downloadCSV(activeTab)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <Download size={18} />
          Export {activeTab} Data
        </button>
      </div>

      <div className="mb-6 flex border-b border-gray-200">
        {(["Financial", "Operational", "Patient"] as ReportTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
              activeTab === tab
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab} Reports
          </button>
        ))}
      </div>

      {activeTab === "Financial" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                label: "Total Hospital Revenue (YTD)",
                value: "₹1,690,000",
                change: "+12.4%",
                icon: DollarSign,
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                label: "Operating Expenses (YTD)",
                value: "₹1,030,000",
                change: "+4.1%",
                icon: TrendingUp,
                color: "bg-blue-100 text-green-700",
              },
              {
                label: "Net Profit Margin",
                value: "39.1%",
                change: "+8.3%",
                icon: BarChart3,
                color: "bg-purple-100 text-purple-700",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="mt-1 text-2xl font-bold text-gray-950">
                        {item.value}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                        <ArrowUpRight size={14} />
                        {item.change} from last year
                      </span>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Revenue vs Expenses Trend (2026)
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExp)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Operational" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                label: "Average Bed Occupancy Rate",
                value: "76.5%",
                icon: Building,
                color: "bg-blue-100 text-green-700",
              },
              {
                label: "Average Length of Stay",
                value: "4.8 Days",
                icon: Calendar,
                color: "bg-purple-100 text-purple-700",
              },
              {
                label: "Total Lab Turnaround Time",
                value: "2.4 Hours",
                icon: Activity,
                color: "bg-emerald-100 text-emerald-700",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="mt-1 text-2xl font-bold text-gray-950">
                        {item.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              Bed Occupancy Breakdown by Room Type
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyByType}>
                  <XAxis dataKey="type" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="occupied" fill="#3B82F6" name="Occupied Beds" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#E5E7EB" name="Total Capacity" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Patient" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Patient Roster Status Breakdown
                </h2>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patientDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {patientDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                {patientDistribution.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {entry.name}: {entry.value} patients
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col">
              <h2 className="text-base font-bold text-gray-900 mb-4 font-semibold">
                Daily Inflow Highlights
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Average Admission Rate", detail: "15 Patient Admission/Day", rate: "90%" },
                  { title: "Out-Patient (OPD) Visits", detail: "210 Outpatients/Day", rate: "95%" },
                  { title: "Lab test requests velocity", detail: "85 Tests/Day", rate: "80%" },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-bold text-gray-950">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: item.rate }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
