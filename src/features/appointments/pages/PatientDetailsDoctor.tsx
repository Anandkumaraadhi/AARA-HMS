
import {
  CalendarDays,
  Clock3,
  Phone,
  UserRound,
  Stethoscope,
  Mail,
  X,
} from "lucide-react";

type Appointment = {
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  issue: string;
  status: string;
};

type DoctorDetailsProps = {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    image: string;
  };

  appointments: Appointment[];

  onClose: () => void;
};

function PatientDetailsDoctor({
  doctor,
  appointments,
  onClose,
}: DoctorDetailsProps) {

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

          <div className="flex items-center gap-4">

            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-20 w-20 rounded-3xl object-cover shadow-md"
            />

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                {doctor.name}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">

                <Stethoscope size={16} />

                {doctor.specialty}

              </div>

            </div>

          </div>

          {/* CLOSE */}

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 transition hover:bg-gray-200"
          >
            <X size={18} />
          </button>

        </div>

        {/* BODY */}

        <div className="max-h-[75vh] overflow-y-auto p-6">

          <div className="space-y-4">

            {appointments.map((item, index) => (

              <div
                key={index}
                className="rounded-3xl border border-gray-100 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* LEFT */}

                  <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">

                      <UserRound size={24} />

                    </div>

                    <div>

                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.patientName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.age} Years • {item.gender}
                      </p>

                      <div className="mt-4 space-y-2">

                        <div className="flex items-center gap-2 text-sm text-gray-700">

                          <Phone size={15} />

                          {item.phone}

                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">

                          <Mail size={15} />

                          {item.email}

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* CENTER */}

                  <div className="space-y-3">

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">

                      <CalendarDays size={16} />

                      {item.date}

                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">

                      <Clock3 size={16} />

                      {item.time}

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="max-w-sm">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Medical Issue
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {item.issue}
                    </p>

                    <span
                      className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold ${item.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "Pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.status}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default PatientDetailsDoctor;