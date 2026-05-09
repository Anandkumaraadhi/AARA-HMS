import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  BriefcaseMedical,
  CalendarDays,
  Camera,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type DoctorStatus = "Active" | "Inactive";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  experience: string;
  fee: string;
  availability: string;
  location: string;
  image: string;
  status: DoctorStatus;
};

type DoctorForm = Omit<Doctor, "id">;

const doctorSpecialties = [
  "General Dentist",
  "Orthodontist",
  "Dental Surgeon",
  "Endodontist",
  "Periodontist",
  "Prosthodontist",
  "Pediatric Dentist",
  "Oral Radiologist",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const defaultForm: DoctorForm = {
  name: "",
  specialty: "General Dentist",
  phone: "",
  email: "",
  experience: "",
  fee: "",
  availability: "Mon, Tue, Wed, Thu, Fri",
  location: "",
  image: "",
  status: "Active",
};

const getAvailabilityDays = (availability: string) => {
  if (availability === "Mon - Fri") return ["Mon", "Tue", "Wed", "Thu", "Fri"];
  if (availability === "Tue - Sat") return ["Tue", "Wed", "Thu", "Fri", "Sat"];
  if (availability === "Mon - Thu") return ["Mon", "Tue", "Wed", "Thu"];
  if (availability === "Wed - Sun") return ["Wed", "Thu", "Fri", "Sat", "Sun"];
  if (availability === "Weekends") return ["Sat", "Sun"];

  return availability
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);
};

const initialDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Aditi Sharma",
    specialty: "Orthodontist",
    phone: "+91 98765 43210",
    email: "aditi.sharma@aara.com",
    experience: "9 years",
    fee: "800",
    availability: "Mon - Fri",
    location: "Bengaluru",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Dr. Rohan Mehta",
    specialty: "Dental Surgeon",
    phone: "+91 91234 56780",
    email: "rohan.mehta@aara.com",
    experience: "12 years",
    fee: "1,200",
    availability: "Tue - Sat",
    location: "Mumbai",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Dr. Nisha Iyer",
    specialty: "Endodontist",
    phone: "+91 99887 76655",
    email: "nisha.iyer@aara.com",
    experience: "7 years",
    fee: "950",
    availability: "Mon - Thu",
    location: "Chennai",
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
  },
];

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<DoctorForm>(defaultForm);
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter((doctor) =>
      [
        doctor.name,
        doctor.specialty,
        doctor.email,
        doctor.phone,
        doctor.location,
        doctor.status,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [doctors, searchTerm]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((currentForm) => ({
        ...currentForm,
        image: reader.result?.toString() ?? "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAvailabilityDayToggle = (day: string) => {
    setForm((currentForm) => {
      const selectedDays = getAvailabilityDays(currentForm.availability);
      const nextDays = selectedDays.includes(day)
        ? selectedDays.filter((selectedDay) => selectedDay !== day)
        : [...selectedDays, day];

      const sortedDays = weekDays.filter((weekDay) => nextDays.includes(weekDay));

      return {
        ...currentForm,
        availability: sortedDays.join(", "),
      };
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(defaultForm);
    setEditingDoctorId(null);
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingDoctorId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    const { id: _id, ...doctorForm } = doctor;

    setForm(doctorForm);
    setEditingDoctorId(doctor.id);
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = (doctorId: number) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!shouldDelete) return;

    setDoctors((currentDoctors) =>
      currentDoctors.filter((doctor) => doctor.id !== doctorId)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.availability) return;

    const savedDoctor = {
      ...form,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    };

    if (editingDoctorId) {
      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          doctor.id === editingDoctorId ? { ...savedDoctor, id: doctor.id } : doctor
        )
      );
    } else {
      setDoctors((currentDoctors) => [
        {
          ...savedDoctor,
          id: Date.now(),
        },
        ...currentDoctors,
      ]);
    }

    closeModal();
  };

  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            AARA Team
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Doctors List
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage doctor profiles, availability, and contact details.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: "Total Doctors",
            value: doctors.length,
            icon: UserRound,
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Specialists",
            value: new Set(doctors.map((doctor) => doctor.specialty)).size,
            icon: Stethoscope,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Active Doctors",
            value: doctors.filter((doctor) => doctor.status === "Active").length,
            icon: CalendarDays,
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
              Doctor Directory
            </h2>
            <p className="text-sm text-gray-500">
              {filteredDoctors.length} profile
              {filteredDoctors.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search doctors..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-[1120px] w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-4">Doctor</th>
                    <th className="px-5 py-4">Specialty</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Availability</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Fee</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="transition hover:bg-blue-50/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-950">
                              {doctor.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {doctor.experience} experience
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          <BriefcaseMedical size={14} />
                          {doctor.specialty}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1.5 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            {doctor.phone}
                          </span>
                          <span className="flex max-w-56 items-center gap-2">
                            <Mail
                              size={14}
                              className="flex-none text-gray-400"
                            />
                            <span className="truncate">{doctor.email}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                          <CalendarDays size={15} className="text-gray-400" />
                          {doctor.availability}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                          <MapPin size={15} className="text-gray-400" />
                          {doctor.location}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-950">
                          Rs. {doctor.fee}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                            doctor.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {doctor.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(doctor)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                            aria-label={`Edit ${doctor.name}`}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                            aria-label={`Delete ${doctor.name}`}
                          >
                            <Trash2 size={16} />
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
              No doctors found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search or add a new doctor profile.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  {editingDoctorId ? "Edit Doctor" : "Add Doctor"}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingDoctorId
                    ? "Update doctor details and availability status."
                    : "Fill all required details to create a profile."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close add doctor form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center text-xs font-medium text-gray-500 transition hover:border-blue-300 hover:bg-blue-50">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Doctor preview"
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
                    Add a clear doctor image. If skipped, a default image is
                    used.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Full Name",
                    name: "name",
                    placeholder: "Dr. Priya Kapoor",
                    type: "text",
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    placeholder: "+91 90000 00000",
                    type: "tel",
                  },
                  {
                    label: "Email",
                    name: "email",
                    placeholder: "doctor@aara.com",
                    type: "email",
                  },
                  {
                    label: "Experience",
                    name: "experience",
                    placeholder: "6 years",
                    type: "text",
                  },
                  {
                    label: "Consultation Fee",
                    name: "fee",
                    placeholder: "750",
                    type: "text",
                  },
                  {
                    label: "Location",
                    name: "location",
                    placeholder: "Hyderabad",
                    type: "text",
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
                      value={form[field.name as keyof DoctorForm]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                ))}

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Specialty <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="specialty"
                    value={form.specialty}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    {doctorSpecialties.map((specialty) => (
                      <option key={specialty}>{specialty}</option>
                    ))}
                  </select>
                </label>

                <div className="space-y-2 md:col-span-2">
                  <span className="text-xs font-semibold text-gray-700">
                    Availability <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {weekDays.map((day) => {
                      const isSelected = getAvailabilityDays(
                        form.availability
                      ).includes(day);

                      return (
                        <label
                          key={day}
                          className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-semibold transition ${
                            isSelected
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAvailabilityDayToggle(day)}
                            className="sr-only"
                          />
                          {day}
                        </label>
                      );
                    })}
                  </div>
                  {!form.availability && (
                    <p className="text-xs font-medium text-red-500">
                      Select at least one day.
                    </p>
                  )}
                </div>

                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </span>
                  <select
                    required
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
                >
                  <Plus size={17} />
                  {editingDoctorId ? "Update Doctor" : "Save Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
