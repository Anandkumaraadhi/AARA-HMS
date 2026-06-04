import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  X,
  FileText,
  Thermometer,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Download,
} from "lucide-react";

type BloodTestStatus = "Normal" | "High" | "Low";

type BloodTestRecord = {
  id: string;
  patientName: string;
  patientId: string;
  testType: string; // Hemoglobin, Glucose, Cholesterol, Thyroid
  measuredValue: number;
  unit: string;
  referenceRange: string;
  testDate: string;
  status: BloodTestStatus;
};

type BloodTestForm = Omit<BloodTestRecord, "id">;

const initialRecords: BloodTestRecord[] = [
  {
    id: "BLD-701",
    patientName: "Rahul Sharma",
    patientId: "PAT-001",
    testType: "Hemoglobin",
    measuredValue: 14.2,
    unit: "g/dL",
    referenceRange: "13.8 - 17.2",
    testDate: "2026-05-20",
    status: "Normal",
  },
  {
    id: "BLD-702",
    patientName: "Priya Reddy",
    patientId: "PAT-002",
    testType: "Fasting Blood Glucose",
    measuredValue: 145,
    unit: "mg/dL",
    referenceRange: "70 - 100",
    testDate: "2026-05-19",
    status: "High",
  },
  {
    id: "BLD-703",
    patientName: "Ananya Iyer",
    patientId: "PAT-003",
    testType: "Total Cholesterol",
    measuredValue: 120,
    unit: "mg/dL",
    referenceRange: "125 - 200",
    testDate: "2026-05-18",
    status: "Low",
  },
];

const defaultForm: BloodTestForm = {
  patientName: "",
  patientId: "",
  testType: "Hemoglobin",
  measuredValue: 0,
  unit: "g/dL",
  referenceRange: "13.8 - 17.2",
  testDate: "",
  status: "Normal",
};

const statusStyles: Record<BloodTestStatus, string> = {
  Normal: "bg-emerald-50 text-emerald-700 border-emerald-100",
  High: "bg-red-50 text-red-700 border-red-100 font-bold",
  Low: "bg-blue-50 text-green-700 border-blue-100 font-bold",
};

const statusIcons = {
  Normal: null,
  High: <TrendingUp size={14} className="text-red-500 inline ml-1" />,
  Low: <TrendingDown size={14} className="text-blue-500 inline ml-1" />,
};

export default function BloodTest() {
  const [records, setRecords] = useState<BloodTestRecord[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | BloodTestStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<BloodTestForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return records.filter((rec) => {
      const matchesStatus = statusFilter === "All" || rec.status === statusFilter;
      const matchesSearch =
        !query ||
        [rec.id, rec.patientName, rec.patientId, rec.testType, rec.status].some((val) =>
          val.toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [records, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      normal: records.filter((r) => r.status === "Normal").length,
      high: records.filter((r) => r.status === "High").length,
      low: records.filter((r) => r.status === "Low").length,
    };
  }, [records]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "measuredValue" ? parseFloat(value) || 0 : value,
    }));
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rec: BloodTestRecord) => {
    const { id: _id, ...formData } = rec;
    setForm(formData);
    setEditingId(rec.id);
    setIsModalOpen(true);
  };

  const handleDownload = (rec: BloodTestRecord) => {
    const content = `
========================================
             BLOOD TEST RECORD
========================================
Record ID:     ${rec.id}
Test Parameter: ${rec.testType}
Test Date:     ${rec.testDate}
Status:        ${rec.status}

Patient Name:  ${rec.patientName} (ID: ${rec.patientId})

MEASURED VALUE:
Result:        ${rec.measuredValue} ${rec.unit}
Normal Range:  ${rec.referenceRange} ${rec.unit}
========================================
AARA Laboratory Analysis.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${rec.id}-${rec.testType}.txt`;
    link.click();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId) {
      setRecords((current) =>
        current.map((rec) => (rec.id === editingId ? { ...form, id: editingId } : rec))
      );
    } else {
      setRecords((current) => [
        {
          ...form,
          id: `BLD-${Date.now().toString().slice(-3)}`,
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
            Pathology Lab
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Blood Test Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track hematology, blood sugars, cholesterol, and other fluid metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Record Blood Test
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Tests Recorded",
            value: stats.total,
            icon: Thermometer,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Normal Ranges",
            value: stats.normal,
            icon: FileText,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "High Indicators",
            value: stats.high,
            icon: AlertCircle,
            color: "bg-red-100 text-red-700",
          },
          {
            label: "Low Indicators",
            value: stats.low,
            icon: TrendingDown,
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
              Blood Test Directory
            </h2>
            <p className="text-sm text-gray-500">
              {filteredRecords.length} record
              {filteredRecords.length === 1 ? "" : "s"} found
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
                placeholder="Search blood test records..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | BloodTestStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-4">Record ID</th>
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Test Parameter</th>
                    <th className="px-5 py-4">Measured Value</th>
                    <th className="px-5 py-4">Reference Range</th>
                    <th className="px-5 py-4">Test Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-sm font-semibold text-gray-950">
                        {rec.id}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-950">
                            {rec.patientName}
                          </p>
                          <p className="text-xs text-gray-500">{rec.patientId}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-950">
                        {rec.testType}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-800 font-semibold">
                        {rec.measuredValue} {rec.unit}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {rec.referenceRange} {rec.unit}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {rec.testDate}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            statusStyles[rec.status]
                          }`}
                        >
                          {rec.status}
                          {statusIcons[rec.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(rec)}
                            className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 text-xs font-semibold transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(rec)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Download size={15} />
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
              No blood test records found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adding a record or modifying filters.
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
                  {editingId ? "Edit Blood Test" : "Record Blood Test"}
                </h2>
                <p className="text-sm text-gray-500">
                  Provide measured value and thresholds for target parameter.
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
                    Patient Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </label>

                <label className="space-y-1.5 block">
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
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Test Parameter <span className="text-red-500">*</span>
                    </span>
                    <select
                      required
                      name="testType"
                      value={form.testType}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    >
                      <option value="Hemoglobin">Hemoglobin</option>
                      <option value="Fasting Blood Glucose">Fasting Blood Glucose</option>
                      <option value="Total Cholesterol">Total Cholesterol</option>
                      <option value="RBC Count">RBC Count</option>
                      <option value="WBC Count">WBC Count</option>
                    </select>
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Measured Value <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      name="measuredValue"
                      value={form.measuredValue}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Unit <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      name="unit"
                      value={form.unit}
                      onChange={handleInputChange}
                      placeholder="e.g. g/dL, mg/dL"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Reference Range <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="text"
                      name="referenceRange"
                      value={form.referenceRange}
                      onChange={handleInputChange}
                      placeholder="e.g. 13.8 - 17.2"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Test Date <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      name="testDate"
                      value={form.testDate}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
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
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                </div>
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
                  {editingId ? "Update Result" : "Save Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
