import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  X,
  Users,
  UserCheck,
  Building,
  CheckCircle,
} from "lucide-react";

type DepartmentStatus = "Active" | "Inactive";

type Department = {
  id: string;
  name: string;
  hodName: string;
  totalDoctors: number;
  totalStaff: number;
  location: string;
  status: DepartmentStatus;
  description: string;
};

type DepartmentForm = Omit<Department, "id">;

const initialDepartments: Department[] = [
  {
    id: "DEP-01",
    name: "Dental",
    hodName: "Dr. Aditi Sharma",
    totalDoctors: 8,
    totalStaff: 15,
    location: "Block A, 2nd Floor",
    status: "Active",
    description: "General dentistry, prosthodontics, and pediatric dental care services.",
  },
  {
    id: "DEP-02",
    name: "Orthodontics",
    hodName: "Dr. Rohan Mehta",
    totalDoctors: 4,
    totalStaff: 8,
    location: "Block A, 3rd Floor",
    status: "Active",
    description: "Correction of misaligned teeth and jaw structure.",
  },
  {
    id: "DEP-03",
    name: "Oral Surgery",
    hodName: "Dr. Rohan Mehta",
    totalDoctors: 3,
    totalStaff: 6,
    location: "Block B, 1st Floor",
    status: "Active",
    description: "Surgical treatments of oral pathology, extractions, and trauma.",
  },
  {
    id: "DEP-04",
    name: "Diagnostics",
    hodName: "Dr. Nisha Iyer",
    totalDoctors: 5,
    totalStaff: 12,
    location: "Block B, Ground Floor",
    status: "Active",
    description: "Laboratory testing, imaging, and diagnostic examinations.",
  },
];

const defaultForm: DepartmentForm = {
  name: "",
  hodName: "",
  totalDoctors: 0,
  totalStaff: 0,
  location: "",
  status: "Active",
  description: "",
};

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | DepartmentStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<DepartmentForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return departments.filter((dep) => {
      const matchesStatus = statusFilter === "All" || dep.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          dep.id,
          dep.name,
          dep.hodName,
          dep.location,
          dep.description,
        ].some((val) => val.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [departments, searchTerm, statusFilter]);

  const activeCount = departments.filter((d) => d.status === "Active").length;
  const totalDoctorsSum = departments.reduce((acc, d) => acc + d.totalDoctors, 0);
  const totalStaffSum = departments.reduce((acc, d) => acc + d.totalStaff, 0);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "totalDoctors" || name === "totalStaff" ? parseInt(value) || 0 : value,
    }));
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dep: Department) => {
    const { id: _id, ...formData } = dep;
    setForm(formData);
    setEditingId(dep.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!shouldDelete) return;

    setDepartments((current) => current.filter((dep) => dep.id !== id));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId) {
      setDepartments((current) =>
        current.map((dep) =>
          dep.id === editingId ? { ...form, id: editingId } : dep
        )
      );
    } else {
      setDepartments((current) => [
        {
          ...form,
          id: `DEP-${Date.now().toString().slice(-2)}`,
        },
        ...current,
      ]);
    }

    setIsModalOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Hospital Structure
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Departments Master
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage hospital departments, heads of department, and structural locations.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Departments",
            value: departments.length,
            icon: Building,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Active Departments",
            value: activeCount,
            icon: CheckCircle,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Total Doctors Assigned",
            value: totalDoctorsSum,
            icon: UserCheck,
            color: "bg-indigo-100 text-indigo-700",
          },
          {
            label: "Total Staff Assigned",
            value: totalStaffSum,
            icon: Users,
            color: "bg-purple-100 text-purple-700",
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
              Department List
            </h2>
            <p className="text-sm text-gray-500">
              {filteredDepartments.length} department
              {filteredDepartments.length === 1 ? "" : "s"} found
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
                placeholder="Search departments..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | DepartmentStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDepartments.map((dep) => (
              <div
                key={dep.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-green-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {dep.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        dep.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {dep.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-950 mb-1">
                    {dep.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {dep.description || "No description provided."}
                  </p>

                  <div className="space-y-2 border-t border-gray-100 pt-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">HOD:</span>
                      <span className="text-gray-950 font-semibold">
                        {dep.hodName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Location:</span>
                      <span className="text-gray-950 font-medium text-right">
                        {dep.location}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Doctors/Staff:</span>
                      <span className="text-gray-950 font-semibold">
                        {dep.totalDoctors} / {dep.totalStaff}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(dep)}
                    className="inline-flex h-9 px-4 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-green-700 text-sm font-semibold transition hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(dep.id)}
                    className="inline-flex h-9 px-4 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-semibold transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
              <Search size={20} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              No departments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adding a department or change filters.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  {editingId ? "Edit Department" : "Add Department"}
                </h2>
                <p className="text-sm text-gray-500">
                  Provide department structural and head coordinates.
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
              <div className="space-y-4">
                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Department Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Periodontics"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Head of Department (HOD) <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="hodName"
                    value={form.hodName}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Nisha Iyer"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Total Doctors
                    </span>
                    <input
                      type="number"
                      name="totalDoctors"
                      value={form.totalDoctors}
                      onChange={handleInputChange}
                      min="0"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                    />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Total Staff
                    </span>
                    <input
                      type="number"
                      name="totalStaff"
                      value={form.totalStaff}
                      onChange={handleInputChange}
                      min="0"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                    />
                  </label>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Location/Room <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Block C, 4th Floor"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Description
                  </span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Brief description of clinical specialty..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
                >
                  {editingId ? "Update Department" : "Save Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
