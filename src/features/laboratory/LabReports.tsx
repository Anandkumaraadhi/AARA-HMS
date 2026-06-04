import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  X,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Download,
} from "lucide-react";

type LabReportStatus = "Completed" | "Pending" | "Critical";

type LabReport = {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  doctorName: string;
  testDate: string;
  status: LabReportStatus;
  resultSummary: string;
};

type LabReportForm = Omit<LabReport, "id">;

const initialReports: LabReport[] = [
  {
    id: "LAB-901",
    patientName: "Rahul Sharma",
    patientId: "PAT-001",
    testName: "Dental X-Ray (Panoramic)",
    doctorName: "Dr. Aditi Sharma",
    testDate: "2026-05-20",
    status: "Completed",
    resultSummary: "Minor root cavity detected on upper-right molar.",
  },
  {
    id: "LAB-902",
    patientName: "Priya Reddy",
    patientId: "PAT-002",
    testName: "Full Blood Count",
    doctorName: "Dr. Rohan Mehta",
    testDate: "2026-05-19",
    status: "Pending",
    resultSummary: "Analysis is in progress by diagnostic lab technicians.",
  },
  {
    id: "LAB-903",
    patientName: "Ananya Iyer",
    patientId: "PAT-003",
    testName: "HB1Ac (Diabetes Profile)",
    doctorName: "Dr. Nisha Iyer",
    testDate: "2026-05-18",
    status: "Critical",
    resultSummary: "HbA1c level is extremely high at 8.9%. Immediate treatment indicated.",
  },
];

const defaultForm: LabReportForm = {
  patientName: "",
  patientId: "",
  testName: "",
  doctorName: "",
  testDate: "",
  status: "Pending",
  resultSummary: "",
};

const statusStyles: Record<LabReportStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Critical: "bg-red-50 text-red-700 border-red-100 animate-pulse",
};

export default function LabReports() {
  const [reports, setReports] = useState<LabReport[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | LabReportStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<LabReportForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return reports.filter((rep) => {
      const matchesStatus = statusFilter === "All" || rep.status === statusFilter;
      const matchesSearch =
        !query ||
        [
          rep.id,
          rep.patientName,
          rep.patientId,
          rep.testName,
          rep.doctorName,
          rep.resultSummary,
        ].some((val) => val.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [reports, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      completed: reports.filter((r) => r.status === "Completed").length,
      pending: reports.filter((r) => r.status === "Pending").length,
      critical: reports.filter((r) => r.status === "Critical").length,
    };
  }, [reports]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rep: LabReport) => {
    const { id: _id, ...formData } = rep;
    setForm(formData);
    setEditingId(rep.id);
    setIsModalOpen(true);
  };

  const handleDownload = (rep: LabReport) => {
    const content = `
========================================
             LABORATORY REPORT
========================================
Report ID:     ${rep.id}
Test Name:     ${rep.testName}
Date:          ${rep.testDate}
Status:        ${rep.status}

Patient Name:  ${rep.patientName} (ID: ${rep.patientId})
Doctor:        ${rep.doctorName}

SUMMARY OF RESULTS:
${rep.resultSummary}
========================================
AARA Diagnostic Services.
`;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${rep.id}-${rep.patientName}.txt`;
    link.click();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (editingId) {
    setReports((current) =>
      current.map((rep) =>
        rep.id === editingId
          ? { ...form, id: editingId }
          : rep
      )
    );
  } else {
    setReports((current) => [
      {
        ...form,
        id: `LAB-${Date.now().toString().slice(-3)}`,
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
            Diagnostics Dept
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Laboratory Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and record diagnostic laboratory tests, results, and thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Record Lab Result
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Lab Reports",
            value: stats.total,
            icon: FileText,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle2,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Pending Results",
            value: stats.pending,
            icon: Calendar,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Critical Reports",
            value: stats.critical,
            icon: AlertTriangle,
            color: "bg-red-100 text-red-700",
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
              Lab Reports Directory
            </h2>
            <p className="text-sm text-gray-500">
              {filteredReports.length} report
              {filteredReports.length === 1 ? "" : "s"} found
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
                placeholder="Search reports..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | LabReportStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {filteredReports.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-4">Report ID</th>
                    <th className="px-5 py-4">Patient</th>
                    <th className="px-5 py-4">Test Name</th>
                    <th className="px-5 py-4">Requested By</th>
                    <th className="px-5 py-4">Test Date</th>
                    <th className="px-5 py-4">Findings/Result</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((rep) => (
                    <tr key={rep.id} className="transition hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-sm font-semibold text-gray-950">
                        {rep.id}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-950">
                            {rep.patientName}
                          </p>
                          <p className="text-xs text-gray-500">{rep.patientId}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-green-700">
                        {rep.testName}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                        {rep.doctorName}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {rep.testDate}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {rep.resultSummary}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                            statusStyles[rep.status]
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(rep)}
                            className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 text-xs font-semibold transition hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(rep)}
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
              No laboratory reports found
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
                  {editingId ? "Edit Lab Result" : "Record Lab Result"}
                </h2>
                <p className="text-sm text-gray-500">
                  Update diagnostic details and findings parameters.
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

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Test Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="testName"
                    value={form.testName}
                    onChange={handleInputChange}
                    placeholder="e.g. Full Blood Count"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Requested By (Doctor) <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    name="doctorName"
                    value={form.doctorName}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Aditi Sharma"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                  />
                </label>

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
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Result Findings/Summary <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    required
                    name="resultSummary"
                    value={form.resultSummary}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="e.g. Normal limits..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
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
