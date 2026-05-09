import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Calendar,
  Clock,
  Eye,
  Mail,
  Phone,
  Plus,
  Search,
  User,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled";

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  department: string;
  reason: string;
  status: AppointmentStatus;
  notes: string;
};

type AppointmentForm = Omit<Appointment, "id">;

const defaultAppointmentForm: AppointmentForm = {
  patientName: "",
  patientPhone: "",
  patientEmail: "",
  doctorName: "",
  appointmentDate: "",
  appointmentTime: "",
  department: "General",
  reason: "",
  status: "Pending",
  notes: "",
};

const initialAppointments: Appointment[] = [
  {
    id: "APT-001",
    patientName: "Rajesh Kumar",
    patientPhone: "+91 98765 11002",
    patientEmail: "rajesh.kumar@email.com",
    doctorName: "Dr. Priya Sharma",
    appointmentDate: "05 May 2026",
    appointmentTime: "10:00 AM",
    department: "Dental",
    reason: "Regular Checkup",
    status: "Confirmed",
    notes: "Patient requires cleaning",
  },
  {
    id: "APT-002",
    patientName: "Neha Singh",
    patientPhone: "+91 91234 77880",
    patientEmail: "neha.singh@email.com",
    doctorName: "Dr. Arjun Verma",
    appointmentDate: "06 May 2026",
    appointmentTime: "02:30 PM",
    department: "Orthodontics",
    reason: "Brace Adjustment",
    status: "Confirmed",
    notes: "Second adjustment session",
  },
  {
    id: "APT-003",
    patientName: "Amit Patel",
    patientPhone: "+91 99887 33115",
    patientEmail: "amit.patel@email.com",
    doctorName: "Dr. Priya Sharma",
    appointmentDate: "07 May 2026",
    appointmentTime: "11:15 AM",
    department: "Dental",
    reason: "Cavity Treatment",
    status: "Pending",
    notes: "Pre-consultation completed",
  },
  {
    id: "APT-004",
    patientName: "Anjali Desai",
    patientPhone: "+91 90909 22110",
    patientEmail: "anjali.desai@email.com",
    doctorName: "Dr. Rohit Gupta",
    appointmentDate: "05 May 2026",
    appointmentTime: "03:00 PM",
    department: "Periodontics",
    reason: "Gum Treatment",
    status: "Cancelled",
    notes: "Cancelled by patient",
  },
];

const statusStyles: Record<AppointmentStatus, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AppointmentStatus>("All");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>(
    defaultAppointmentForm
  );

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return appointments.filter((apt) => {
      const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          apt.id,
          apt.patientName,
          apt.patientPhone,
          apt.patientEmail,
          apt.doctorName,
          apt.appointmentDate,
          apt.department,
          apt.reason,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter, appointments]);

  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "Confirmed"
  ).length;
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "Pending"
  ).length;
  const departments = new Set(appointments.map((apt) => apt.department)).size;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setAppointmentForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setAppointmentForm(defaultAppointmentForm);
  };

  const handleAddAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAppointments((currentAppointments) => [
      {
        ...appointmentForm,
        id: `APT-${String(currentAppointments.length + 1).padStart(3, "0")}`,
      },
      ...currentAppointments,
    ]);
    closeAddModal();
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Patient Management
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule, manage, and track patient appointments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Appointment
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Appointments",
            value: appointments.length,
            icon: Calendar,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Confirmed",
            value: confirmedAppointments,
            icon: CheckCircle,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Pending",
            value: pendingAppointments,
            icon: AlertCircle,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Departments",
            value: departments,
            icon: User,
            color: "bg-indigo-100 text-indigo-700",
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
              Appointment List
            </h2>
            <p className="text-sm text-gray-500">
              {filteredAppointments.length} appointment
              {filteredAppointments.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search appointments..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | AppointmentStatus)
              }
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#93c5fd_#f1f5f9]">
              <table className="min-w-[1200px] w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Doctor</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="transition hover:bg-blue-50/50">
                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-950">
                            {apt.patientName}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">{apt.id}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {apt.doctorName}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1.5 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            {apt.patientPhone}
                          </span>
                          <span className="flex max-w-56 items-center gap-2">
                            <Mail size={14} className="flex-none text-gray-400" />
                            <span className="truncate">{apt.patientEmail}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1.5 text-sm font-medium text-gray-700">
                          <span className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {apt.appointmentDate}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            {apt.appointmentTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                          {apt.department}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {apt.reason}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[apt.status]}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedAppointment(apt)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                            aria-label={`View ${apt.patientName} appointment`}
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
            <h3 className="text-sm font-semibold text-gray-900">
              No appointments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search or status filter.
            </p>
          </div>
        )}
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  {selectedAppointment.patientName}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedAppointment.id} • {selectedAppointment.appointmentDate}{" "}
                  at {selectedAppointment.appointmentTime}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close appointment details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedAppointment.status]}`}
                >
                  {selectedAppointment.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {selectedAppointment.department}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Patient Name",
                    value: selectedAppointment.patientName,
                    icon: User,
                  },
                  {
                    label: "Doctor",
                    value: selectedAppointment.doctorName,
                    icon: User,
                  },
                  {
                    label: "Phone",
                    value: selectedAppointment.patientPhone,
                    icon: Phone,
                  },
                  {
                    label: "Email",
                    value: selectedAppointment.patientEmail,
                    icon: Mail,
                  },
                  {
                    label: "Appointment Date",
                    value: selectedAppointment.appointmentDate,
                    icon: Calendar,
                  },
                  {
                    label: "Appointment Time",
                    value: selectedAppointment.appointmentTime,
                    icon: Clock,
                  },
                  {
                    label: "Department",
                    value: selectedAppointment.department,
                    icon: User,
                  },
                  {
                    label: "Reason",
                    value: selectedAppointment.reason,
                    icon: Calendar,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
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

              {selectedAppointment.notes && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Notes
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Add Appointment
                </h2>
                <p className="text-sm text-gray-500">
                  Fill all required details to schedule a new appointment.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close add appointment form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Patient Name",
                    name: "patientName",
                    type: "text",
                    placeholder: "Patient full name",
                  },
                  {
                    label: "Phone",
                    name: "patientPhone",
                    type: "tel",
                    placeholder: "+91 90000 00000",
                  },
                  {
                    label: "Email",
                    name: "patientEmail",
                    type: "email",
                    placeholder: "patient@email.com",
                  },
                  {
                    label: "Doctor Name",
                    name: "doctorName",
                    type: "text",
                    placeholder: "Dr. Name",
                  },
                  {
                    label: "Appointment Date",
                    name: "appointmentDate",
                    type: "text",
                    placeholder: "02 May 2026",
                  },
                  {
                    label: "Appointment Time",
                    name: "appointmentTime",
                    type: "text",
                    placeholder: "10:00 AM",
                  },
                  {
                    label: "Reason",
                    name: "reason",
                    type: "text",
                    placeholder: "Reason for appointment",
                  },
                ].map((field) => (
                  <label key={field.name} className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-700">
                      {field.label} <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type={field.type}
                      name={field.name}
                      value={
                        appointmentForm[
                          field.name as keyof AppointmentForm
                        ]
                      }
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                ))}

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="department"
                    value={appointmentForm.department}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Dental</option>
                    <option>Orthodontics</option>
                    <option>Periodontics</option>
                    <option>Endodontics</option>
                    <option>Cosmetic</option>
                    <option>Implants</option>
                    <option>Pediatric</option>
                    <option>General</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="status"
                    value={appointmentForm.status}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                  </select>
                </label>
              </div>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-700">
                  Notes
                </span>
                <textarea
                  name="notes"
                  value={appointmentForm.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}