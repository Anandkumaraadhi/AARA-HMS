import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  X,
  Building,
  Bed,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type RoomType = "General" | "Sharing" | "Private" | "ICU";
type RoomStatus = "Available" | "Occupied" | "Maintenance";

type Room = {
  id: string;
  roomNo: string;
  roomType: RoomType;
  capacity: number;
  occupancy: number;
  status: RoomStatus;
  floor: string;
};

type RoomForm = Omit<Room, "id">;

const initialRooms: Room[] = [
  {
    id: "RM-001",
    roomNo: "ICU-01",
    roomType: "ICU",
    capacity: 2,
    occupancy: 2,
    status: "Occupied",
    floor: "Block A, 1st Floor",
  },
  {
    id: "RM-002",
    roomNo: "Room-204",
    roomType: "Sharing",
    capacity: 4,
    occupancy: 2,
    status: "Available",
    floor: "Block A, 2nd Floor",
  },
  {
    id: "RM-003",
    roomNo: "Room-305",
    roomType: "Private",
    capacity: 1,
    occupancy: 0,
    status: "Available",
    floor: "Block B, 3rd Floor",
  },
  {
    id: "RM-004",
    roomNo: "Room-102",
    roomType: "General",
    capacity: 8,
    occupancy: 0,
    status: "Maintenance",
    floor: "Block B, 1st Floor",
  },
];

const defaultForm: RoomForm = {
  roomNo: "",
  roomType: "General",
  capacity: 1,
  occupancy: 0,
  status: "Available",
  floor: "Block A, 1st Floor",
};

const statusStyles: Record<RoomStatus, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Occupied: "bg-blue-50 text-green-700 border-blue-100",
  Maintenance: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | RoomType>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<RoomForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredRooms = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return rooms.filter((rm) => {
      const matchesType = typeFilter === "All" || rm.roomType === typeFilter;
      const matchesSearch =
        !query ||
        [rm.roomNo, rm.roomType, rm.floor, rm.status].some((val) =>
          val.toLowerCase().includes(query)
        );

      return matchesType && matchesSearch;
    });
  }, [rooms, searchTerm, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: rooms.length,
      available: rooms.filter((r) => r.status === "Available").length,
      occupied: rooms.filter((r) => r.status === "Occupied").length,
      maintenance: rooms.filter((r) => r.status === "Maintenance").length,
    };
  }, [rooms]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]:
        name === "capacity" || name === "occupancy" ? parseInt(value) || 0 : value,
    }));
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rm: Room) => {
    const { id: _id, ...formData } = rm;
    setForm(formData);
    setEditingId(rm.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!shouldDelete) return;

    setRooms((current) => current.filter((r) => r.id !== id));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.occupancy > form.capacity) {
      alert("Occupancy cannot exceed capacity.");
      return;
    }

    if (editingId) {
      setRooms((current) =>
        current.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
      );
    } else {
      setRooms((current) => [
        {
          ...form,
          id: `RM-${Date.now().toString().slice(-3)}`,
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
            Ward Settings
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Rooms Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Define, edit, and audit room configurations, categories, and maintenance statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Room
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Rooms",
            value: stats.total,
            icon: Building,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Available Rooms",
            value: stats.available,
            icon: CheckCircle,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Occupied Rooms",
            value: stats.occupied,
            icon: Bed,
            color: "bg-indigo-100 text-indigo-700",
          },
          {
            label: "Under Maintenance",
            value: stats.maintenance,
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
              Rooms List
            </h2>
            <p className="text-sm text-gray-500">
              {filteredRooms.length} room
              {filteredRooms.length === 1 ? "" : "s"} found
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
                placeholder="Search rooms..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "All" | RoomType)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Room Types</option>
              <option value="General">General</option>
              <option value="Sharing">Sharing</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
            </select>
          </div>
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((rm) => (
              <div
                key={rm.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-green-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {rm.roomType}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        statusStyles[rm.status]
                      }`}
                    >
                      {rm.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-950 mb-1">
                    Room {rm.roomNo}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{rm.floor}</p>

                  <div className="space-y-2 border-t border-gray-100 pt-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Occupancy Range:</span>
                      <span className="text-gray-950 font-bold">
                        {rm.occupancy} / {rm.capacity} beds occupied
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(rm.occupancy / rm.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-50 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(rm)}
                    className="inline-flex h-9 px-4 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-green-700 text-sm font-semibold transition hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rm.id)}
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
              No rooms found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a room configuration to get started.
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
                  {editingId ? "Edit Room" : "Create Room"}
                </h2>
                <p className="text-sm text-gray-500">
                  Configure capacity, type, and location details.
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
                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Room No/Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="roomNo"
                    value={form.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g. ICU-01, Room-202"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Room Type <span className="text-red-500">*</span>
                    </span>
                    <select
                      required
                      name="roomType"
                      value={form.roomType}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    >
                      <option value="General">General</option>
                      <option value="Sharing">Sharing</option>
                      <option value="Private">Private</option>
                      <option value="ICU">ICU</option>
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
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Bed Capacity <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Current Occupancy
                    </span>
                    <input
                      type="number"
                      name="occupancy"
                      value={form.occupancy}
                      onChange={handleInputChange}
                      min="0"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Floor/Location <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="floor"
                    value={form.floor}
                    onChange={handleInputChange}
                    placeholder="e.g. Block A, 1st Floor"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                  />
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
                  {editingId ? "Update Room" : "Save Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
