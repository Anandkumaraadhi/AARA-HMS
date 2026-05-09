import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  Eye,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Search,
  Timer,
  UserCheck,
  Users,
  X,
} from "lucide-react";

type AttendanceStatus = "Present" | "Late" | "Absent" | "Half Day" | "On Leave";

type AttendanceRecord = {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workedHours: string;
  shift: string;
  location: string;
  status: AttendanceStatus;
  image: string;
};

const attendanceRecords: AttendanceRecord[] = [
  {
    id: "STF-001",
    name: "Kavya Nair",
    role: "Receptionist",
    department: "Front Desk",
    phone: "+91 98765 11002",
    email: "kavya.nair@aara.com",
    date: "2026-05-02",
    checkIn: "08:55 AM",
    checkOut: "05:10 PM",
    workedHours: "8h 15m",
    shift: "Morning",
    location: "Bengaluru",
    status: "Present",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-002",
    name: "Arjun Rao",
    role: "Dental Assistant",
    department: "Clinical",
    phone: "+91 91234 77880",
    email: "arjun.rao@aara.com",
    date: "2026-05-02",
    checkIn: "09:22 AM",
    checkOut: "05:30 PM",
    workedHours: "8h 08m",
    shift: "Morning",
    location: "Mumbai",
    status: "Late",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-003",
    name: "Meera Singh",
    role: "Lab Technician",
    department: "Diagnostics",
    phone: "+91 99887 33115",
    email: "meera.singh@aara.com",
    date: "2026-05-02",
    checkIn: "--",
    checkOut: "--",
    workedHours: "0h",
    shift: "General",
    location: "Chennai",
    status: "On Leave",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-004",
    name: "Farhan Ali",
    role: "Billing Executive",
    department: "Accounts",
    phone: "+91 90909 22110",
    email: "farhan.ali@aara.com",
    date: "2026-05-01",
    checkIn: "09:05 AM",
    checkOut: "01:10 PM",
    workedHours: "4h 05m",
    shift: "Morning",
    location: "Hyderabad",
    status: "Half Day",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-005",
    name: "Nisha Varma",
    role: "Nurse",
    department: "Clinical",
    phone: "+91 90000 44556",
    email: "nisha.varma@aara.com",
    date: "2026-05-01",
    checkIn: "--",
    checkOut: "--",
    workedHours: "0h",
    shift: "Evening",
    location: "Bengaluru",
    status: "Absent",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80",
  },
];

const statusStyles: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700",
  Late: "bg-amber-50 text-amber-700",
  Absent: "bg-red-50 text-red-700",
  "Half Day": "bg-blue-50 text-blue-700",
  "On Leave": "bg-gray-100 text-gray-600",
};

export default function AttendeceDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("2026-05-02");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AttendanceStatus>("All");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const departments = Array.from(
    new Set(attendanceRecords.map((record) => record.department))
  );

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return attendanceRecords.filter((record) => {
      const matchesDate = !dateFilter || record.date === dateFilter;
      const matchesDepartment =
        departmentFilter === "All" || record.department === departmentFilter;
      const matchesStatus = statusFilter === "All" || record.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          record.id,
          record.name,
          record.role,
          record.department,
          record.phone,
          record.email,
          record.shift,
          record.location,
          record.status,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesDate && matchesDepartment && matchesStatus && matchesSearch;
    });
  }, [dateFilter, departmentFilter, searchTerm, statusFilter]);

  const todaysRecords = attendanceRecords.filter((record) => record.date === dateFilter);
  const presentCount = todaysRecords.filter((record) => record.status === "Present").length;
  const lateCount = todaysRecords.filter((record) => record.status === "Late").length;
  const absentCount = todaysRecords.filter((record) => record.status === "Absent").length;

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Staff Attendance
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Attendance Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track daily attendance, shift timing, worked hours, and staff status.
          </p>
        </div>

        <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm">
          <CalendarDays size={18} className="text-blue-600" />
          {dateFilter || "All Dates"}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Records", value: todaysRecords.length, icon: Users, color: "bg-blue-100 text-blue-700" },
          { label: "Present", value: presentCount, icon: UserCheck, color: "bg-emerald-100 text-emerald-700" },
          { label: "Late", value: lateCount, icon: Timer, color: "bg-amber-100 text-amber-700" },
          { label: "Absent", value: absentCount, icon: BadgeCheck, color: "bg-red-100 text-red-700" },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-950">{item.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon size={19} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Attendance Directory</h2>
            <p className="text-sm text-gray-500">
              {filteredRecords.length} record{filteredRecords.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end">
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search attendance..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              aria-label="Attendance date"
            />

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option>All</option>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "All" | AttendanceStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option>All</option>
              <option>Present</option>
              <option>Late</option>
              <option>Absent</option>
              <option>Half Day</option>
              <option>On Leave</option>
            </select>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#93c5fd_#f1f5f9]">
              <table className="min-w-[1240px] w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Staff</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Check In</th>
                    <th className="px-5 py-4">Check Out</th>
                    <th className="px-5 py-4">Worked Hours</th>
                    <th className="px-5 py-4">Shift</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <tr key={`${record.id}-${record.date}`} className="transition hover:bg-blue-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={record.image} alt={record.name} className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-950">{record.name}</p>
                            <p className="mt-1 text-xs text-gray-500">{record.id} • {record.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">{record.department}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                          <CalendarDays size={15} className="text-gray-400" />
                          {record.date}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <LogIn size={15} className="text-gray-400" />
                          {record.checkIn}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <LogOut size={15} className="text-gray-400" />
                          {record.checkOut}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                          {record.workedHours}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Clock size={15} className="text-gray-400" />
                          {record.shift}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MapPin size={15} className="text-gray-400" />
                          {record.location}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[record.status]}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                            aria-label={`View ${record.name}`}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
              <Search size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No attendance found</h3>
            <p className="mt-1 text-sm text-gray-500">Try another date, search, department, or status.</p>
          </div>
        )}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <img src={selectedRecord.image} alt={selectedRecord.name} className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">{selectedRecord.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedRecord.id} • {selectedRecord.role} • {selectedRecord.department}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close attendance details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedRecord.status]}`}>
                  {selectedRecord.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {selectedRecord.workedHours}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
                  {selectedRecord.shift} shift
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Phone Number", value: selectedRecord.phone, icon: Phone },
                  { label: "Email", value: selectedRecord.email, icon: Mail },
                  { label: "Date", value: selectedRecord.date, icon: CalendarDays },
                  { label: "Check In", value: selectedRecord.checkIn, icon: LogIn },
                  { label: "Check Out", value: selectedRecord.checkOut, icon: LogOut },
                  { label: "Worked Hours", value: selectedRecord.workedHours, icon: Timer },
                  { label: "Location", value: selectedRecord.location, icon: MapPin },
                  { label: "Shift", value: selectedRecord.shift, icon: Clock },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                          <p className="mt-1 break-words text-sm font-semibold text-gray-950">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
