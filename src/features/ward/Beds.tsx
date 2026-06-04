import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  X,
  Bed,
  CheckCircle,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

type BedStatus = "Available" | "Occupied" | "Cleaning" | "Out of Service";

type BedRecord = {
  id: string;
  bedNo: string;
  roomNo: string;
  bedType: string;
  status: BedStatus;
  patientName?: string;
};

type BedForm = Omit<BedRecord, "id">;

const initialBeds: BedRecord[] = [
  {
    id: "BD-001",
    bedNo: "Bed-A",
    roomNo: "ICU-01",
    bedType: "ICU",
    status: "Occupied",
    patientName: "Amit Kumar",
  },
  {
    id: "BD-002",
    bedNo: "Bed-B",
    roomNo: "ICU-01",
    bedType: "ICU",
    status: "Occupied",
    patientName: "Sneha Patel",
  },
  {
    id: "BD-003",
    bedNo: "Bed-A",
    roomNo: "Room-204",
    bedType: "Standard",
    status: "Available",
  },
  {
    id: "BD-004",
    bedNo: "Bed-B",
    roomNo: "Room-204",
    bedType: "Standard",
    status: "Cleaning",
  },
];

const defaultForm: BedForm = {
  bedNo: "",
  roomNo: "",
  bedType: "Standard",
  status: "Available",
  patientName: "",
};

const statusStyles: Record<BedStatus, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Occupied: "bg-blue-50 text-green-700 border-blue-100",
  Cleaning: "bg-amber-50 text-amber-700 border-amber-100",
  "Out of Service": "bg-red-50 text-red-700 border-red-100",
};

export default function Beds() {
  const [beds, setBeds] = useState<BedRecord[]>(initialBeds);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | BedStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<BedForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredBeds = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return beds.filter((bd) => {
      const matchesStatus = statusFilter === "All" || bd.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          bd.bedNo,
          bd.roomNo,
          bd.bedType,
          bd.status,
          bd.patientName || "",
        ].some((val) => val.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [beds, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: beds.length,
      available: beds.filter((b) => b.status === "Available").length,
      occupied: beds.filter((b) => b.status === "Occupied").length,
      cleaning: beds.filter((b) => b.status === "Cleaning").length,
    };
  }, [beds]);

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

  const openEditModal = (bd: BedRecord) => {
    const { id: _id, ...formData } = bd;
    setForm({
      ...formData,
      patientName: formData.patientName || "",
    });
    setEditingId(bd.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this bed layout?"
    );
    if (!shouldDelete) return;

    setBeds((current) => current.filter((b) => b.id !== id));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const recordToSave: BedRecord = {
      bedNo: form.bedNo,
      roomNo: form.roomNo,
      bedType: form.bedType,
      status: form.status,
      patientName: form.status === "Occupied" ? form.patientName : undefined,
      id: editingId || `BD-${Date.now().toString().slice(-3)}`,
    };

    if (editingId) {
      setBeds((current) =>
        current.map((b) => (b.id === editingId ? recordToSave : b))
      );
    } else {
      setBeds((current) => [recordToSave, ...current]);
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
            Ward & Inventory
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Beds Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage bed layout allocations, patient occupancy mappings, and housekeeping.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Bed Layout
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Beds",
            value: stats.total,
            icon: Bed,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Available",
            value: stats.available,
            icon: CheckCircle,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Occupied",
            value: stats.occupied,
            icon: UserCheck,
            color: "bg-indigo-100 text-indigo-700",
          },
          {
            label: "In Cleaning",
            value: stats.cleaning,
            icon: AlertTriangle,
            color: "bg-amber-100 text-amber-700",
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
              Beds Registry
            </h2>
            <p className="text-sm text-gray-500">
              {filteredBeds.length} bed
              {filteredBeds.length === 1 ? "" : "s"} registered
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
                placeholder="Search by Bed, Room, Patient..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | BedStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>

        {filteredBeds.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-4">Bed ID</th>
                    <th className="px-5 py-4">Bed No</th>
                    <th className="px-5 py-4">Room Mapped</th>
                    <th className="px-5 py-4">Bed Type</th>
                    <th className="px-5 py-4">Current Patient</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBeds.map((bd) => (
                    <tr key={bd.id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-sm font-semibold text-gray-950">
                        {bd.id}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-800">
                        {bd.bedNo}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 font-medium">
                        {bd.roomNo}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {bd.bedType}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {bd.patientName || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            statusStyles[bd.status]
                          }`}
                        >
                          {bd.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(bd)}
                            className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 text-xs font-semibold transition hover:bg-blue-100"
                          >
                            Edit Layout
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(bd.id)}
                            className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 text-xs font-semibold transition hover:bg-red-100"
                          >
                            Remove
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
              No beds layout registered
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adding a bed layout configuration.
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
                  {editingId ? "Edit Bed Layout" : "Create Bed Layout"}
                </h2>
                <p className="text-sm text-gray-500">
                  Provide bed identifiers, type, and mapped room.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Bed Label/No <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      name="bedNo"
                      value={form.bedNo}
                      onChange={handleInputChange}
                      placeholder="e.g. Bed-A"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Room Mapped <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      name="roomNo"
                      value={form.roomNo}
                      onChange={handleInputChange}
                      placeholder="e.g. Room-204"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Bed Category <span className="text-red-500">*</span>
                    </span>
                    <select
                      required
                      name="bedType"
                      value={form.bedType}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    >
                      <option value="Standard">Standard</option>
                      <option value="ICU">ICU</option>
                      <option value="Semi-Private">Semi-Private</option>
                      <option value="Deluxe">Deluxe</option>
                    </select>
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
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </label>
                </div>

                {form.status === "Occupied" && (
                  <label className="space-y-1.5 block">
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
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>
                )}
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
                  {editingId ? "Update Bed" : "Save Bed Layout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
