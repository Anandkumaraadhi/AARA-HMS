import { useState } from "react";

import {
  CalendarDays,
  UserRound,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Eye,
} from "lucide-react";
import PatientDetailsDoctor from "./PatientDetailsDoctor";

type ScheduleStatus =
  | "Available"
  | "Booked"
  | "On Leave";

type DoctorSchedule = {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  experience: string;
  availability: string;
  patients: number;
  nextappointment: number;
  location: string;
  status: ScheduleStatus;
  image: string;
};


const schedules: DoctorSchedule[] = [
  {
    id: 1,
    name: "Dr. Aditi Sharma",
    specialty: "Orthodontist",
    phone: "+91 98765 43210",
    email: "aditi.sharma@aara.com",
    experience: "9 years",
    availability: "Mon - Fri",
    patients: 12,
    nextappointment: 50,
    location: "Bengaluru",
    status: "Available",
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
    availability: "Tue - Sat",
    patients: 8,
    nextappointment: 50,
    location: "Mumbai",
    status: "Booked",
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
    availability: "Mon - Thu",
    patients: 0,
    nextappointment: 50,
    location: "Chennai",
    status: "On Leave",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
  },
];

const statusStyles: Record<
  ScheduleStatus,
  string
> = {
  Available:
    "bg-emerald-100 text-emerald-700",

  Booked:
    "bg-blue-100 text-green-700",

  "On Leave":
    "bg-red-100 text-red-700",
};

function DoctorSchedule() {


  const [searchTerm, setSearchTerm] =
    useState("");

  // ADD HERE
  const [selectedDoctor, setSelectedDoctor] =
    useState("All");
  const [selectedDoctorAppointments, setSelectedDoctorAppointments] =
    useState<any>(null);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5 md:p-6">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-950">
            Doctor Schedule
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage doctor availability,
            appointments, and timings.
          </p>

        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 button-gradient text-white shadow-lg transition hover:scale-[1.02]">

          <Plus size={18} />

          Add Schedule

        </button>

      </div>

      {/* CARDS */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {[
          {
            label: "Total Doctors",
            value: 24,
            icon: UserRound,
            color:
              "bg-blue-100 text-green-700",
          },
          {
            label: "Available",
            value: 18,
            icon: CheckCircle2,
            color:
              "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Booked",
            value: 12,
            icon: CalendarDays,
            color:
              "bg-orange-100 text-orange-700",
          },
          {
            label: "On Leave",
            value: 3,
            icon: XCircle,
            color:
              "bg-red-100 text-red-700",
          },
        ].map((item) => {

          const Icon: any = item.icon;

          return (

            <div
              key={item.label}
              className="rounded-3xl border border-white/40 bg-white/80 p-5 shadow-lg backdrop-blur-xl"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon size={24} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur-xl">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Doctor Availability
            </h2>

            <p className="text-sm text-gray-500">
              View and manage doctor schedules
            </p>

          </div>

          {/* SEARCH */}

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="h-11 w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 sm:w-72"
              />

            </div>

            {/* DOCTOR FILTER */}

            <select
              value={selectedDoctor}
              onChange={(e) =>
                setSelectedDoctor(e.target.value)
              }
              className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >

              <option value="All">
                All Doctors
              </option>

              {schedules.map((doctor) => (

                <option
                  key={doctor.id}
                  value={doctor.name}
                >
                  {doctor.name}
                </option>

              ))}

            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-gray-50/80">

              <tr className="text-left">

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Doctor
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Specialization
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Patients
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Today's Patients
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Upcoming Appointments
                </th>


                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

              </tr>

            </thead>
            <tbody>

              {schedules
                .filter((item) => {

                  const matchesSearch =
                    [
                      item.name,
                      item.specialty,
                      item.location,
                      item.status,
                    ]
                      .join(" ")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                  const matchesDoctor =
                    selectedDoctor === "All" ||
                    item.name === selectedDoctor;

                  return (
                    matchesSearch &&
                    matchesDoctor
                  );

                })
                .map((item) => (

                  <tr
                    key={item.id}
                    className="border-t border-gray-100 transition hover:bg-emerald-50/40"
                  >

                    {/* DOCTOR */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-2xl object-cover shadow-sm"
                        />

                        <div>

                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            ID : DOC-{item.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* SPECIALITY */}

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-medium text-gray-900">
                          {item.specialty}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.experience} Experience
                        </p>

                      </div>

                    </td>

                    {/* CONTACT */}

                    <td className="px-6 py-5">

                      <div className="space-y-2">

                        <div className="flex items-center gap-2 text-sm text-gray-700">

                          <Phone size={14} />

                          {item.phone}

                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">

                          <Mail size={14} />

                          <span className="max-w-[180px] truncate">
                            {item.email}
                          </span>

                        </div>

                      </div>

                    </td>



                    {/* AVAILABILITY */}

                    <td className="px-6 py-5">

                      <div>

                        <p className="font-medium text-gray-900">
                          {item.availability}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.location}
                        </p>

                      </div>

                    </td>

                    {/* PATIENTS */}

                    <td className="px-6 py-5">

                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-gray-700">

                        {item.patients} Patients

                      </span>

                    </td>


                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">

                        <span className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-500 whitespace-nowrap">
                          {item.nextappointment} Patients
                        </span>

                        <button
                          onClick={() => setSelectedDoctorAppointments(item)}
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 transition hover:bg-blue-100 shrink-0"
                        >
                          <Eye size={16} />
                        </button>

                      </div>
                    </td>
                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>

                    </td>


                  </tr>

                ))}

            </tbody>


          </table>

        </div>

      </div>
      {selectedDoctorAppointments && (

        <PatientDetailsDoctor

          doctor={{
            id: selectedDoctorAppointments.id,
            name: selectedDoctorAppointments.name,
            specialty: selectedDoctorAppointments.specialty,
            image: selectedDoctorAppointments.image,
          }}

          appointments={[
            {
              patientName: "Rahul Sharma",
              age: 28,
              gender: "Male",
              phone: "+91 9876543210",
              email: "rahul@email.com",
              date: "22 May 2026",
              time: "10:30 AM",
              issue: "Tooth Pain",
              status: "Confirmed",
            },
            {
              patientName: "Sneha Reddy",
              age: 31,
              gender: "Female",
              phone: "+91 9988776655",
              email: "sneha@email.com",
              date: "23 May 2026",
              time: "12:15 PM",
              issue: "Braces Adjustment",
              status: "Pending",
            },
            {
              patientName: "Karan Mehta",
              age: 40,
              gender: "Male",
              phone: "+91 9090909090",
              email: "karan@email.com",
              date: "25 May 2026",
              time: "04:00 PM",
              issue: "Root Canal Follow-up",
              status: "Confirmed",
            },
          ]}

          onClose={() =>
            setSelectedDoctorAppointments(null)
          }

        />

      )}
    </div>
  );
}

export default DoctorSchedule;