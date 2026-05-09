import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Clock,
  Eye,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

type StaffStatus = "Active" | "On Leave" | "Inactive";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  emergencyContact: string;
  email: string;
  shift: string;
  joiningDate: string;
  attendance: string;
  salary: string;
  location: string;
  status: StaffStatus;
  image: string;
};

type StaffForm = Omit<StaffMember, "id">;

const defaultStaffForm: StaffForm = {
  name: "",
  role: "",
  department: "Front Desk",
  phone: "",
  emergencyContact: "",
  email: "",
  shift: "Morning",
  joiningDate: "",
  attendance: "100%",
  salary: "",
  location: "",
  status: "Active",
  image: "",
};

const initialStaffMembers: StaffMember[] = [
  {
    id: "STF-001",
    name: "Kavya Nair",
    role: "Receptionist",
    department: "Front Desk",
    phone: "+91 98765 11002",
    emergencyContact: "+91 98765 11003",
    email: "kavya.nair@aara.com",
    shift: "Morning",
    joiningDate: "12 Jan 2025",
    attendance: "96%",
    salary: "Rs. 32,000",
    location: "Bengaluru",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-002",
    name: "Arjun Rao",
    role: "Dental Assistant",
    department: "Clinical",
    phone: "+91 91234 77880",
    emergencyContact: "+91 91234 77881",
    email: "arjun.rao@aara.com",
    shift: "Evening",
    joiningDate: "03 Aug 2024",
    attendance: "91%",
    salary: "Rs. 38,000",
    location: "Mumbai",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-003",
    name: "Meera Singh",
    role: "Lab Technician",
    department: "Diagnostics",
    phone: "+91 99887 33115",
    emergencyContact: "+91 99887 33116",
    email: "meera.singh@aara.com",
    shift: "General",
    joiningDate: "18 Mar 2025",
    attendance: "88%",
    salary: "Rs. 42,000",
    location: "Chennai",
    status: "On Leave",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "STF-004",
    name: "Farhan Ali",
    role: "Billing Executive",
    department: "Accounts",
    phone: "+91 90909 22110",
    emergencyContact: "+91 90909 22111",
    email: "farhan.ali@aara.com",
    shift: "Morning",
    joiningDate: "22 Nov 2023",
    attendance: "84%",
    salary: "Rs. 36,000",
    location: "Hyderabad",
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  },
];

const statusStyles: Record<StaffStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  "On Leave": "bg-amber-50 text-amber-700",
  Inactive: "bg-gray-100 text-gray-600",
};

export default function StaffDetails() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | StaffStatus>("All");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState<StaffForm>(defaultStaffForm);

  const filteredStaff = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return staffMembers.filter((staff) => {
      const matchesStatus = statusFilter === "All" || staff.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          staff.id,
          staff.name,
          staff.role,
          staff.department,
          staff.phone,
          staff.emergencyContact,
          staff.email,
          staff.shift,
          staff.location,
          staff.status,
        ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  const activeStaff = staffMembers.filter((staff) => staff.status === "Active").length;
  const onLeaveStaff = staffMembers.filter((staff) => staff.status === "On Leave").length;
  const departments = new Set(staffMembers.map((staff) => staff.department)).size;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setStaffForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setStaffForm((currentForm) => ({
        ...currentForm,
        image: reader.result?.toString() ?? "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setStaffForm(defaultStaffForm);
  };

  const handleAddStaff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStaffMembers((currentStaff) => [
      {
        ...staffForm,
        id: `STF-${String(currentStaff.length + 1).padStart(3, "0")}`,
        image:
          staffForm.image ||
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      },
      ...currentStaff,
    ]);
    closeAddModal();
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Operations Team
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Staff Details
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage staff roles, shifts, attendance, salary, and contact details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Staff", value: staffMembers.length, icon: Users, color: "bg-blue-100 text-blue-700" },
          { label: "Active Staff", value: activeStaff, icon: BadgeCheck, color: "bg-emerald-100 text-emerald-700" },
          { label: "On Leave", value: onLeaveStaff, icon: CalendarDays, color: "bg-amber-100 text-amber-700" },
          { label: "Departments", value: departments, icon: BriefcaseBusiness, color: "bg-indigo-100 text-indigo-700" },
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
            <h2 className="text-base font-semibold text-gray-900">Staff Directory</h2>
            <p className="text-sm text-gray-500">
              {filteredStaff.length} member{filteredStaff.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search staff..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "All" | StaffStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option>All</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {filteredStaff.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#93c5fd_#f1f5f9]">
              <table className="min-w-[1180px] w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Staff</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Shift</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Attendance</th>
                    <th className="px-5 py-4">Salary</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="transition hover:bg-blue-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.image}
                            alt={staff.name}
                            className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-950">{staff.name}</p>
                            <p className="mt-1 text-xs text-gray-500">{staff.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">{staff.role}</p>
                        <p className="mt-1 text-xs text-gray-500">{staff.department}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1.5 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            {staff.phone}
                          </span>
                          <span className="flex max-w-56 items-center gap-2">
                            <Mail size={14} className="flex-none text-gray-400" />
                            <span className="truncate">{staff.email}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                          <Clock size={15} className="text-gray-400" />
                          {staff.shift}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">{staff.joiningDate}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                          {staff.attendance}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-950">{staff.salary}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MapPin size={15} className="text-gray-400" />
                          {staff.location}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[staff.status]}`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedStaff(staff)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                            aria-label={`View ${staff.name}`}
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
            <h3 className="text-sm font-semibold text-gray-900">No staff found</h3>
            <p className="mt-1 text-sm text-gray-500">Try a different search or status filter.</p>
          </div>
        )}
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStaff.image}
                  alt={selectedStaff.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">{selectedStaff.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedStaff.id} • {selectedStaff.role} • {selectedStaff.department}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close staff details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedStaff.status]}`}>
                  {selectedStaff.status}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {selectedStaff.shift} shift
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  Attendance {selectedStaff.attendance}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Phone Number", value: selectedStaff.phone, icon: Phone },
                  { label: "Emergency Contact", value: selectedStaff.emergencyContact, icon: Phone },
                  { label: "Email", value: selectedStaff.email, icon: Mail },
                  { label: "Department", value: selectedStaff.department, icon: BriefcaseBusiness },
                  { label: "Role", value: selectedStaff.role, icon: ShieldCheck },
                  { label: "Joining Date", value: selectedStaff.joiningDate, icon: CalendarDays },
                  { label: "Salary", value: selectedStaff.salary, icon: BadgeCheck },
                  { label: "Location", value: selectedStaff.location, icon: MapPin },
                  { label: "Shift", value: selectedStaff.shift, icon: Clock },
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  Add Staff
                </h2>
                <p className="text-sm text-gray-500">
                  Fill all required details to add a new staff member.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close add staff form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-5 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center text-xs font-medium text-gray-500 transition hover:border-blue-300 hover:bg-blue-50">
                  {staffForm.image ? (
                    <img
                      src={staffForm.image}
                      alt="Staff preview"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <>
                      <Camera size={24} className="mb-2 text-gray-400" />
                      Upload Image
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Profile photo
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-gray-500">
                    Add a clear staff image. If skipped, a default image is used.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "Staff name" },
                  { label: "Phone", name: "phone", type: "tel", placeholder: "+91 90000 00000" },
                  { label: "Emergency Contact", name: "emergencyContact", type: "tel", placeholder: "+91 90000 00001" },
                  { label: "Email", name: "email", type: "email", placeholder: "staff@aara.com" },
                  { label: "Joining Date", name: "joiningDate", type: "text", placeholder: "02 May 2026" },
                  { label: "Attendance", name: "attendance", type: "text", placeholder: "95%" },
                  { label: "Salary", name: "salary", type: "text", placeholder: "Rs. 35,000" },
                  { label: "Location", name: "location", type: "text", placeholder: "Bengaluru" },
                ].map((field) => (
                  <label key={field.name} className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-700">
                      {field.label} <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type={field.type}
                      name={field.name}
                      value={staffForm[field.name as keyof StaffForm]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                ))}

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="role"
                    value={staffForm.role}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select role</option>
                    <option>Receptionist</option>
                    <option>Dental Assistant</option>
                    <option>Lab Technician</option>
                    <option>Billing Executive</option>
                    <option>Nurse</option>
                    <option>Clinic Manager</option>
                    <option>Housekeeping Staff</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="department"
                    value={staffForm.department}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Front Desk</option>
                    <option>Clinical</option>
                    <option>Diagnostics</option>
                    <option>Accounts</option>
                    <option>Housekeeping</option>
                    <option>Administration</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Shift <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="shift"
                    value={staffForm.shift}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>General</option>
                    <option>Night</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="status"
                    value={staffForm.status}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>

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
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
