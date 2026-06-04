import { X } from "lucide-react";

interface AddPatientListProps {
    isOpen: boolean;
    onClose: () => void;
}

function AddPatientList({
    isOpen,
    onClose,
}: AddPatientListProps) {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                    }`}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-screen
    w-full
    sm:w-[90%]
    md:w-[75%]
    lg:w-[60%]
    xl:w-[50%]
    bg-white shadow-2xl overflow-y-auto
    transform transition-all duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
            >
                <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Add Patient
                        </h2>
                        <p className="text-sm text-gray-500">
                            Create a new patient record
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div
                    className={`space-y-6 p-6 transition-all duration-500 delay-100 ${isOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                        }`}
                >
                    {/* Patient Information */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Patient Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Patient ID
                                </label>
                                <input
                                    type="text"
                                    value="Auto Generated"
                                    disabled
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Patient Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter patient name"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    placeholder="+91 9876543210"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="patient@email.com"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    placeholder="Age"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Blood Group
                                </label>
                                <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3">
                                    <option>A+</option>
                                    <option>B+</option>
                                    <option>O+</option>
                                    <option>AB+</option>
                                    <option>A-</option>
                                    <option>B-</option>
                                    <option>O-</option>
                                    <option>AB-</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Medical Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Chief Complaint
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Diagnosis / Clinical Info
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Assigned Doctor
                                </label>
                                <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3">
                                    <option>Select Doctor</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3">
                                    <option>Active</option>
                                    <option>Follow-up</option>
                                    <option>Critical</option>
                                    <option>Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Allergies
                                </label>
                                <input
                                    type="text"
                                    placeholder="Allergies"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Current Medications
                                </label>
                                <input
                                    type="text"
                                    placeholder="Current Medications"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Medical History
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Appointment Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Registration Date
                                </label>
                                <input
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Last Visit
                                </label>
                                <input
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Next Visit
                                </label>
                                <input
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Billing */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Billing & Insurance
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Invoice Number"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />

                            <input
                                type="text"
                                placeholder="Insurance Provider"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />

                            <input
                                type="text"
                                placeholder="Policy Number"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Address Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <textarea
                                rows={3}
                                placeholder="Address"
                                className="md:col-span-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3"
                            />

                            <input
                                type="text"
                                placeholder="City"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />

                            <input
                                type="text"
                                placeholder="State"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />

                            <input
                                type="text"
                                placeholder="Pincode"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Emergency Contact
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <input
                                type="text"
                                placeholder="Contact Name"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />

                            <input
                                type="text"
                                placeholder="Relationship"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3"
                            />
                        </div>
                    </div>

                    {/* Appointment Information */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Appointment Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Last Visit
                                </label>
                                <input
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 focus:border-blue-400 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Next Visit
                                </label>
                                <input
                                    type="date"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 focus:border-blue-400 focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Billing Information */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Billing Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Invoice Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="INV-2026-1001"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 focus:border-blue-400 focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Insurance
                                </label>
                                <input
                                    type="text"
                                    placeholder="Insurance Provider"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 focus:border-blue-400 focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Location Details
                        </h3>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="Enter city or address"
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 focus:border-blue-400 focus:bg-white focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 flex flex-col sm:flex-row justify-end gap-3 border-t bg-white px-6 py-4">
                    <button className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-2">
                        Cancel
                    </button>

                    <button className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2 text-white">
                        Save Patient
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddPatientList;