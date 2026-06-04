import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Eye,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import AddPatientList from "./AddPatientList";
import CommonDataTable from "@/shared/components/common/CommonDataTable";
import { MRT_ColumnDef } from "material-react-table";

type PatientStatus = "Active" | "Follow-up" | "Critical" | "Inactive" | "Cancelled";
type DateFilter = "All" | "Today" | "Last7Days" | "LastMonth" | "Custom";
type PaymentStatus = "Paid" | "Partial" | "Unpaid";

type PaymentMode = "Cash" | "Card" | "UPI" | "QR" | "Insurance";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;

  condition: string;
  assignedDoctor: string;

  lastVisit: string;
  lastVisitDate: string;
  nextAppointment: string;
  nextAppointmentDate: string;

  invoiceNumber: string;

  totalAmount: number;
  amountReceived: number;
  balanceAmount: number;

  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;

  insurance: string;
  location: string;
  status: PatientStatus;
};

const patients: Patient[] = [
  {
    id: "#PT0025",
    name: "Rahul Sharma",
    age: 34,
    gender: "Male",
    phone: "+91 98765 43210",
    email: "rahul.sharma@email.com",
    bloodGroup: "B+",
    condition: "Root canal follow-up",
    assignedDoctor: "Dr. Aditi Sharma",
    lastVisit: "29 Apr 2026",
    lastVisitDate: "2026-04-29",
    nextAppointment: "04 May 2026, 10:30 AM",
    nextAppointmentDate: "2026-05-04",
    invoiceNumber: "INV-2026-1025",
    totalAmount: 12000,
    amountReceived: 12000,
    balanceAmount: 0,
    paymentStatus: "Paid",
    paymentMode: "Card",
    insurance: "Star Health",
    location: "Bengaluru",
    status: "Follow-up",
  },
  {
    id: "#PT0024",
    name: "Priya Reddy",
    age: 28,
    gender: "Female",
    phone: "+91 91234 56780",
    email: "priya.reddy@email.com",
    bloodGroup: "O+",
    condition: "Clear aligner review",
    assignedDoctor: "Dr. Rohan Mehta",
    lastVisit: "28 Apr 2026",
    lastVisitDate: "2026-04-28",
    nextAppointment: "06 May 2026, 11:15 AM",
    nextAppointmentDate: "2026-05-06",
    invoiceNumber: "INV-2026-1024",
    totalAmount: 35000,
    amountReceived: 15000,
    balanceAmount: 20000,
    paymentStatus: "Partial",
    paymentMode: "UPI",
    insurance: "Self Pay",
    location: "Hyderabad",
    status: "Active",
  },
  {
    id: "#PT0023",
    name: "Ananya Iyer",
    age: 42,
    gender: "Female",
    phone: "+91 99887 76655",
    email: "ananya.iyer@email.com",
    bloodGroup: "A-",
    condition: "Gum inflammation",
    assignedDoctor: "Dr. Nisha Iyer",
    lastVisit: "26 Apr 2026",
    lastVisitDate: "2026-04-26",
    nextAppointment: "02 May 2026, 03:00 PM",
    nextAppointmentDate: "2026-05-02",
    invoiceNumber: "INV-2026-1023",
    totalAmount: 8000,
    amountReceived: 0,
    balanceAmount: 8000,
    paymentStatus: "Unpaid",
    paymentMode: "Cash",
    insurance: "HDFC Ergo",
    location: "Chennai",
    status: "Critical",
  },
  {
    id: "#PT0022",
    name: "Vikram Kapoor",
    age: 51,
    gender: "Male",
    phone: "+91 90909 11122",
    email: "vikram.kapoor@email.com",
    bloodGroup: "AB+",
    condition: "Implant consultation",
    assignedDoctor: "Dr. Mehta",
    lastVisit: "20 Apr 2026",
    lastVisitDate: "2026-04-20",
    nextAppointment: "04 May 2026, 10:30 AM",
    nextAppointmentDate: "",
    invoiceNumber: "INV-2026-1022",
    totalAmount: 75000,
    amountReceived: 50000,
    balanceAmount: 25000,
    paymentStatus: "Partial",
    paymentMode: "QR",
    insurance: "ICICI Lombard",
    location: "Mumbai",
    status: "Inactive",
  },
  {
    id: "#PT0022",
    name: "Vikram Kapoor",
    age: 51,
    gender: "Male",
    phone: "+91 90909 11122",
    email: "vikram.kapoor@email.com",
    bloodGroup: "AB+",
    condition: "Implant consultation",
    assignedDoctor: "Dr. Mehta",
    lastVisit: "20 Apr 2026",
    lastVisitDate: "2026-04-20",
    nextAppointment: "04 May 2026, 10:30 AM",
    nextAppointmentDate: "",
    invoiceNumber: "INV-2026-1022",
    totalAmount: 75000,
    amountReceived: 50000,
    balanceAmount: 25000,
    paymentStatus: "Partial",
    paymentMode: "QR",
    insurance: "ICICI Lombard",
    location: "Mumbai",
    status: "Inactive",
  },
  {
    id: "#PT0022",
    name: "Vikram Kapoor",
    age: 51,
    gender: "Male",
    phone: "+91 90909 11122",
    email: "vikram.kapoor@email.com",
    bloodGroup: "AB+",
    condition: "Implant consultation",
    assignedDoctor: "Dr. Mehta",
    lastVisit: "20 Apr 2026",
    lastVisitDate: "2026-04-20",
    nextAppointment: "04 May 2026, 10:30 AM",
    nextAppointmentDate: "",
    invoiceNumber: "INV-2026-1022",
    totalAmount: 75000,
    amountReceived: 50000,
    balanceAmount: 25000,
    paymentStatus: "Partial",
    paymentMode: "QR",
    insurance: "ICICI Lombard",
    location: "Mumbai",
    status: "Cancelled",
  },
  {
    id: "#PT0022",
    name: "Vikram Kapoor",
    age: 51,
    gender: "Male",
    phone: "+91 90909 11122",
    email: "vikram.kapoor@email.com",
    bloodGroup: "AB+",
    condition: "Implant consultation",
    assignedDoctor: "Dr. Mehta",
    lastVisit: "20 Apr 2026",
    lastVisitDate: "2026-04-20",
    nextAppointment: "04 May 2026, 10:30 AM",
    nextAppointmentDate: "",
    invoiceNumber: "INV-2026-1022",
    totalAmount: 75000,
    amountReceived: 50000,
    balanceAmount: 25000,
    paymentStatus: "Partial",
    paymentMode: "QR",
    insurance: "ICICI Lombard",
    location: "Mumbai",
    status: "Inactive",
  },

  {
    id: "#PT0022",
    name: "22222222 Kapoor",
    age: 51,
    gender: "Male",
    phone: "+91 90909 11122",
    email: "vikram.kapoor@email.com",
    bloodGroup: "AB+",
    condition: "Implant consultation",
    assignedDoctor: "Dr. Mehta",
    lastVisit: "20 Apr 2026",
    lastVisitDate: "2026-04-20",
    nextAppointment: "04 May 2026, 10:30 AM",
    nextAppointmentDate: "",
    invoiceNumber: "INV-2026-1022",
    totalAmount: 75000,
    amountReceived: 50000,
    balanceAmount: 25000,
    paymentStatus: "Partial",
    paymentMode: "QR",
    insurance: "ICICI Lombard",
    location: "Mumbai",
    status: "Cancelled",
  },
];

// const statusStyles: Record<PatientStatus, string> = {
//   Active: "bg-emerald-50 text-emerald-700",
//   "Follow-up": "bg-blue-50 text-green-700",
//   Critical: "bg-red-50 text-red-700",
//   Inactive: "bg-gray-100 text-gray-600",
//   Cancelled: "bg-red-100 text-red-600",
// };

const todayDate = "2026-05-02";

const getDate = (date: string) => new Date(`${date}T00:00:00`);

const addDays = (date: string, days: number) => {
  const nextDate = getDate(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const addMonths = (date: string, months: number) => {
  const nextDate = getDate(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
};

const isDateInRange = (date: string, start: Date, end: Date) => {
  if (!date) return false;

  const value = getDate(date);
  return value >= start && value <= end;
};




export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | PatientStatus>("All");
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesStatus = statusFilter === "All" || patient.status === statusFilter;
      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "Today" &&
          isDateInRange(
            patient.nextAppointmentDate,
            getDate(todayDate),
            getDate(todayDate)
          )) ||
        (dateFilter === "Last7Days" &&
          isDateInRange(
            patient.lastVisitDate,
            addDays(todayDate, -6),
            getDate(todayDate)
          )) ||
        (dateFilter === "LastMonth" &&
          isDateInRange(
            patient.lastVisitDate,
            addMonths(todayDate, -1),
            getDate(todayDate)
          )) ||
        (dateFilter === "Custom" &&
          (!customStartDate ||
            !customEndDate ||
            isDateInRange(
              patient.lastVisitDate,
              getDate(customStartDate),
              getDate(customEndDate)
            )));
      const matchesSearch =
        !query ||
        [
          patient.id,
          patient.name,
          patient.phone,
          patient.email,
          patient.invoiceNumber,
          patient.condition,
          patient.assignedDoctor,
          patient.location,
          patient.status,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [customEndDate, customStartDate, dateFilter, searchTerm, statusFilter]);

  const statusStyles: Record<string, string> = {
    Active: "bg-green-50 text-green-700",
    Pending: "bg-red-50 text-red-700",
    Critical: "bg-red-50 text-red-700",
    "Follow-up": "bg-blue-50 text-green-700",
    Inactive: "bg-gray-100 text-gray-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  const statusPayment: Record<string, string> = {
    Paid: "bg-green-50 text-green-700",
    Partial: "bg-yellow-50 text-yellow-700",
    Unpaid: "bg-red-50 text-red-700",
    Pending: "bg-red-50 text-red-700",
  };

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice No.",
        size: 140,
      },

      {
        accessorKey: "name",
        header: "Patient",
        size: 220,
        Cell: ({ row }: any) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {row.original.name}
            </span>

            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-500">
                Age: {row.original.age}
              </span>

              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 font-semibold text-red-700">
                {row.original.bloodGroup}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 130,
        Cell: ({ cell }: any) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[cell.getValue()] || "bg-gray-100 text-gray-600"
              }`}
          >
            {cell.getValue()}
          </span>
        ),
      },

      {
        accessorKey: "condition",
        header: "Clinical Info",
        size: 250,
      },
      {
        accessorKey: "assignedDoctor",
        header: "Doctor",
        size: 200,
      },
      {
        accessorKey: "nextAppointment",
        header: "Appointment",
        size: 220,
      },
      {
        accessorKey: "amountReceived",
        header: "Received",
        size: 140,
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        size: 120,
        Cell: ({ cell }: any) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusPayment[cell.getValue()] || "bg-gray-100 text-gray-600"
              }`}
          >
            {cell.getValue()}
          </span>
        ),
      },


      // New columns
      {
        accessorKey: "insurance",
        header: "Insurance",
        size: 180,
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 100,
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        size: 150,
      },
      {
        accessorKey: "balanceAmount",
        header: "Balance",
        size: 150,
      },
      {
        accessorKey: "lastVisit",
        header: "Last Visit",
        size: 180,
      },
    ],
    []
  );

  const statusCounts = patients.reduce(
    (counts, patient) => ({
      ...counts,
      [patient.status]: counts[patient.status] + 1,
    }),
    { Active: 0, "Follow-up": 0, Critical: 0, Inactive: 0 } as Record<PatientStatus, number>
  );


  const handleSendMail = (_patient: Patient) => {
    console.log("send mail");
  }
  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Patient Care
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Patients List
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track patient profiles, treatment needs, appointments, and care status.
          </p>
        </div>

        <button onClick={() => setIsAddPatientOpen(true)} className="px-5 py-3 button-gradient text-white rounded-2xl hover:scale-[1.02] transition">
          + Add Patient
        </button>

        <AddPatientList
          isOpen={isAddPatientOpen}
          onClose={() => setIsAddPatientOpen(false)}
        />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Patients",
            value: patients.length,
            icon: Users,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Active Patients",
            value: statusCounts.Active,
            icon: HeartPulse,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Follow-ups",
            value: statusCounts["Follow-up"],
            icon: CalendarDays,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Critical Cases",
            value: statusCounts.Critical,
            icon: Activity,
            color: "bg-red-100 text-red-700",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-950">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                >
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
            <h2 className="text-base font-semibold text-gray-900">
              Patient Directory
            </h2>
            <p className="text-sm text-gray-500">
              {filteredPatients.length} record
              {filteredPatients.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end">
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search patients..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | PatientStatus)
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option>All</option>
              <option>Active</option>
              <option>Follow-up</option>
              <option>Critical</option>
              <option>Inactive</option>
            </select>

            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value as DateFilter)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All visits</option>
              <option value="Today">Today's patients</option>
              <option value="Last7Days">Last 7 days</option>
              <option value="LastMonth">Last 1 month</option>
              <option value="Custom">Custom date</option>
            </select>

            {dateFilter === "Custom" && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(event) => setCustomStartDate(event.target.value)}
                  className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  aria-label="Custom start date"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) => setCustomEndDate(event.target.value)}
                  className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  aria-label="Custom end date"
                />
              </div>
            )}
          </div>
        </div>

        {filteredPatients.length > 0 ? (
          /* FIX: Explicitly enforce standard grid boundaries on the wrapper */
          <div className="grid grid-cols-1 min-w-0 w-full rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <CommonDataTable
                columns={columns}
                data={filteredPatients}
                renderRowActions={({ row }) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendMail(row.original)}
                      className="rounded-lg bg-yellow-50 p-2 text-yellow-700 hover:bg-yellow-100"
                      title="Email"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedPatient(row.original)}
                      className="rounded-lg bg-green-50 p-2 text-green-700 hover:bg-green-100"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
              <Search size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              No patients found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search or status filter.
            </p>
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-green-700">
                  <UserRound size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.id} • {selectedPatient.age} yrs •{" "}
                    {selectedPatient.gender}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close patient details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedPatient.status]}`}
                >
                  {selectedPatient.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  {selectedPatient.invoiceNumber}
                </span>
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                  Blood Group {selectedPatient.bloodGroup}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Phone Number",
                    value: selectedPatient.phone,
                    icon: Phone,
                  },
                  {
                    label: "Email",
                    value: selectedPatient.email,
                    icon: Mail,
                  },
                  {
                    label: "Assigned Doctor",
                    value: selectedPatient.assignedDoctor,
                    icon: ShieldCheck,
                  },
                  {
                    label: "Condition",
                    value: selectedPatient.condition,
                    icon: Activity,
                  },
                  {
                    label: "Last Visit",
                    value: selectedPatient.lastVisit,
                    icon: ClipboardList,
                  },
                  {
                    label: "Next Visit",
                    value: selectedPatient.nextAppointment,
                    icon: CalendarDays,
                  },
                  {
                    label: "Insurance",
                    value: selectedPatient.insurance,
                    icon: FileText,
                  },
                  {
                    label: "Location",
                    value: selectedPatient.location,
                    icon: MapPin,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {item.label}
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold text-gray-950">
                            {item.value}
                          </p>
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
