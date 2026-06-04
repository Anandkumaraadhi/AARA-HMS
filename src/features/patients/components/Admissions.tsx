import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  User,
  X,
  UserCheck,
  Bed,
  CheckCircle,
  ArrowRightLeft,
} from "lucide-react";

type AdmissionStatus = "Admitted" | "Discharged" | "Transferred";

type Admission = {
  id: string;
  patientName: string;
  patientId: string;
  roomNo: string;
  bedNo: string;
  admissionDate: string;
  dischargeDate?: string;
  doctorName: string;
  department: string;
  status: AdmissionStatus;
};

type AdmissionForm = Omit<Admission, "id">;

const initialAdmissions: Admission[] = [
  {
    id: "ADM-101",
    patientName: "Amit Kumar",
    patientId: "PAT-001",
    roomNo: "ICU-02",
    bedNo: "Bed-A",
    admissionDate: "2026-06-01",
    doctorName: "Dr. Aditi Sharma",
    department: "Dental",
    status: "Admitted",
  },
  {
    id: "ADM-102",
    patientName: "Sneha Patel",
    patientId: "PAT-002",
    roomNo: "Room-204",
    bedNo: "Bed-B",
    admissionDate: "2026-05-28",
    doctorName: "Dr. Rohan Mehta",
    department: "Oral Surgery",
    status: "Admitted",
  },
  {
    id: "ADM-103",
    patientName: "Vikram Malhotra",
    patientId: "PAT-003",
    roomNo: "Room-105",
    bedNo: "Bed-A",
    admissionDate: "2026-05-10",
    dischargeDate: "2026-05-15",
    doctorName: "Dr. Nisha Iyer",
    department: "Endodontics",
    status: "Discharged",
  },
];

const defaultForm: AdmissionForm = {
  patientName: "",
  patientId: "",
  roomNo: "",
  bedNo: "",
  admissionDate: "",
  doctorName: "",
  department: "Dental",
  status: "Admitted",
};

const statusStyles: Record<AdmissionStatus, string> = {
  Admitted: "bg-emerald-50 text-emerald-700",
  Discharged: "bg-gray-100 text-gray-600",
  Transferred: "bg-blue-50 text-green-700",
};

export default function Admissions() {
  const [admissions, setAdmissions] = useState<Admission[]>(initialAdmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | AdmissionStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<AdmissionForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredAdmissions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return admissions.filter((adm) => {
      const matchesStatus = statusFilter === "All" || adm.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          adm.id,
          adm.patientName,
          adm.patientId,
          adm.roomNo,
          adm.bedNo,
          adm.doctorName,
          adm.department,
        ].some((val) => val.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [admissions, searchTerm, statusFilter]);

  const activeAdmissions = admissions.filter((a) => a.status === "Admitted").length;
  const dischargedAdmissions = admissions.filter((a) => a.status === "Discharged").length;
  const transferredAdmissions = admissions.filter((a) => a.status === "Transferred").length;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (adm: Admission) => {
    const { id: _id, ...formData } = adm;
    setForm(formData);
    setEditingId(adm.id);
    setIsModalOpen(true);
  };

  const handleDischarge = (id: string) => {
    const shouldDischarge = window.confirm(
      "Are you sure you want to discharge this patient?"
    );
    if (!shouldDischarge) return;

    setAdmissions((current) =>
      current.map((adm) =>
        adm.id === id
          ? {
              ...adm,
              status: "Discharged" as const,
              dischargeDate: new Date().toISOString().split("T")[0],
            }
          : adm
      )
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId) {
      setAdmissions((current) =>
        current.map((adm) =>
          adm.id === editingId ? { ...form, id: editingId } : adm
        )
      );
    } else {
      setAdmissions((current) => [
        {
          ...form,
          id: `ADM-${Date.now().toString().slice(-3)}`,
        },
        ...current,
      ]);
    }

    setIsModalOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Ward & Patients
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Admissions Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage patient admissions, room assignments, and discharge statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          New Admission
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Admissions",
            value: admissions.length,
            icon: User,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Currently Admitted",
            value: activeAdmissions,
            icon: UserCheck,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Discharged",
            value: dischargedAdmissions,
            icon: CheckCircle,
            color: "bg-gray-100 text-gray-700",
          },
          {
            label: "Transferred",
            value: transferredAdmissions,
            icon: ArrowRightLeft,
            color: "bg-blue-100 text-green-700",
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
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Admissions List
            </h2>
            <p className="text-sm text-gray-500">
              {filteredAdmissions.length} admission
              {filteredAdmissions.length === 1 ? "" : "s"} found
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search admissions..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | AdmissionStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-400 focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>
        </div>

        {filteredAdmissions.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-4">Admission ID</th>
                    <th className="px-5 py-4">Patient Name</th>
                    <th className="px-5 py-4">Room/Bed</th>
                    <th className="px-5 py-4">Admission Date</th>
                    <th className="px-5 py-4">Discharge Date</th>
                    <th className="px-5 py-4">Doctor</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAdmissions.map((adm) => (
                    <tr key={adm.id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-sm font-semibold text-gray-950">
                        {adm.id}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-950">
                            {adm.patientName}
                          </p>
                          <p className="text-xs text-gray-500">{adm.patientId}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        <span className="flex items-center gap-1.5 font-medium text-gray-800">
                          <Bed size={15} className="text-gray-400" />
                          {adm.roomNo} - {adm.bedNo}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {adm.admissionDate}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {adm.dischargeDate || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-700">
                        {adm.doctorName}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {adm.department}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[adm.status]
                          }`}
                        >
                          {adm.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(adm)}
                            className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 text-xs font-semibold transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          {adm.status === "Admitted" && (
                            <button
                              type="button"
                              onClick={() => handleDischarge(adm.id)}
                              className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 text-xs font-semibold transition hover:bg-emerald-100"
                            >
                              Discharge
                            </button>
                          )}
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
              No admissions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search query or filter criteria.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  {editingId ? "Edit Admission" : "New Admission"}
                </h2>
                <p className="text-sm text-gray-500">
                  Fill in the required information to assign a patient to a room/bed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Patient Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleInputChange}
                    placeholder="e.g. Amit Kumar"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Patient ID <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="patientId"
                    value={form.patientId}
                    onChange={handleInputChange}
                    placeholder="e.g. PAT-001"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Room No <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="roomNo"
                    value={form.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g. ICU-02, Room-101"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Bed No <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="bedNo"
                    value={form.bedNo}
                    onChange={handleInputChange}
                    placeholder="e.g. Bed-A"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Admission Date <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="date"
                    name="admissionDate"
                    value={form.admissionDate}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Doctor Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="doctorName"
                    value={form.doctorName}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Aditi Sharma"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="department"
                    value={form.department}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  >
                    <option value="Dental">Dental</option>
                    <option value="Orthodontics">Orthodontics</option>
                    <option value="Oral Surgery">Oral Surgery</option>
                    <option value="Endodontics">Endodontics</option>
                    <option value="Periodontics">Periodontics</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
                  >
                    <option value="Admitted">Admitted</option>
                    <option value="Discharged">Discharged</option>
                    <option value="Transferred">Transferred</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
                >
                  {editingId ? "Update Admission" : "Save Admission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
