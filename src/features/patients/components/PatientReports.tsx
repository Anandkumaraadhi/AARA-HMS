import { useMemo, useState, useEffect } from "react";


import {
    FileText,
    Search,
    Download,
    Eye,
    CalendarDays,
    UserRound,
    Activity,
    ClipboardCheck,
    Mail,
    X,
    Send,
    Phone,
    Hospital,
} from "lucide-react";
import * as XLSX from "xlsx";
import MonthYearFilter from "@/shared/components/common/MonthYearFilter";

type ReportStatus = "Completed" | "Pending" | "Critical";

type Report = {
    id: string;
    patientName: string;
    doctor: string;
    department: string;
    reportType: string;
    date: string;
    status: ReportStatus;
    email: string;
    phone: string;
    diagnosis: string;
    prescription: string;
};

const reports: Report[] = [
    {
        id: "#REP1025",
        patientName: "Rahul Sharma",
        doctor: "Dr. Aditi Sharma",
        department: "Dental",
        reportType: "X-Ray Report",
        date: "20 May 2026",
        status: "Completed",
        email: "rahul@email.com",
        phone: "+91 9876543210",
        diagnosis: "Mild cavity detected in upper molar.",
        prescription: "Root canal treatment suggested.",
    },
    {
        id: "#REP1024",
        patientName: "Priya Reddy",
        doctor: "Dr. Rohan Mehta",
        department: "Orthodontics",
        reportType: "Aligner Progress",
        date: "19 February 2026",
        status: "Pending",
        email: "priya@email.com",
        phone: "+91 9988776655",
        diagnosis: "Teeth alignment progressing well.",
        prescription: "Continue aligners for 4 more weeks.",
    },
    {
        id: "#REP1023",
        patientName: "Ananya Iyer",
        doctor: "Dr. Nisha Iyer",
        department: "Periodontics",
        reportType: "Blood Test",
        date: "18 May 2026",
        status: "Critical",
        email: "ananya@email.com",
        phone: "+91 9090909090",
        diagnosis: "High infection markers detected.",
        prescription: "Immediate medication and follow-up required.",
    },
];

const statusStyles: Record<ReportStatus, string> = {
    Completed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
};

function PatientReports() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const [statusFilter, setStatusFilter] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleDownload = (report: Report) => {
        const content = `
            PATIENT REPORT

            Patient Name : ${report.patientName}
            Report ID    : ${report.id}
            Doctor       : ${report.doctor}
            Department   : ${report.department}
            Report Type  : ${report.reportType}
            Date         : ${report.date}
            Status       : ${report.status}

            Diagnosis:
            ${report.diagnosis}

            Prescription:
            ${report.prescription}
    `;

        const blob = new Blob([content], { type: "text/plain" });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = `${report.patientName}-report.txt`;

        link.click();
    };

    const handleMail = (report: Report) => {
        const subject = `Medical Report - ${report.patientName}`;

        const body = `
            Patient Name: ${report.patientName}
            Doctor: ${report.doctor}
            Department: ${report.department}
            Report Type: ${report.reportType}

            Diagnosis:
            ${report.diagnosis}

            Prescription:
            ${report.prescription}
                `;

        window.location.href = `mailto:${report.email}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
    };

    const currentYear = new Date().getFullYear();

    const [reportsFilter, setReportsFilter] =
        useState({
            month: new Date().getMonth(),
            year: currentYear,
        });

    const [completedFilter, setCompletedFilter] =
        useState({
            month: new Date().getMonth(),
            year: currentYear,
        });

    const [pendingFilter, setPendingFilter] =
        useState({
            month: new Date().getMonth(),
            year: currentYear,
        });

    const [criticalFilter, setCriticalFilter] =
        useState({
            month: new Date().getMonth(),
            year: currentYear,
        });


    const totalReports = reports.filter((report) => {

        const date = new Date(
            Date.parse(report.date)
        );

        return (
            date.getMonth() === reportsFilter.month &&
            date.getFullYear() === reportsFilter.year
        );

    }).length;


    const completedReports = reports.filter((report) => {

        const date = new Date(
            Date.parse(report.date)
        );

        return (
            report.status === "Completed" &&
            date.getMonth() === completedFilter.month &&
            date.getFullYear() === completedFilter.year
        );

    }).length;


    const pendingReports = reports.filter((report) => {

        const date = new Date(
            Date.parse(report.date)
        );

        return (
            report.status === "Pending" &&
            date.getMonth() === pendingFilter.month &&
            date.getFullYear() === pendingFilter.year
        );

    }).length;


    const criticalReports = reports.filter((report) => {

        const date = new Date(
            Date.parse(report.date)
        );

        return (
            report.status === "Critical" &&
            date.getMonth() === criticalFilter.month &&
            date.getFullYear() === criticalFilter.year
        );

    }).length;
    const filteredReports = useMemo(() => {
        return reports.filter((report) => {

            const matchesSearch = [
                report.id,
                report.patientName,
                report.doctor,
                report.department,
                report.reportType,
                report.status,
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || report.status === statusFilter;

            const reportDate = new Date(report.date);

            const matchesStartDate =
                !startDate || reportDate >= new Date(startDate);

            const matchesEndDate =
                !endDate || reportDate <= new Date(endDate);

            const matchesMonthYear =
                reportDate.getMonth() === reportsFilter.month &&
                reportDate.getFullYear() === reportsFilter.year;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesStartDate &&
                matchesEndDate &&
                matchesMonthYear
            );
        });
    }, [searchTerm, statusFilter, startDate, endDate, reportsFilter]);


    // ============================
    // EXPORT TO EXCEL FUNCTION
    // ============================

    const exportToExcel = () => {

        const exportData = filteredReports.map((item) => ({
            ReportID: item.id,
            PatientName: item.patientName,
            Doctor: item.doctor,
            Department: item.department,
            ReportType: item.reportType,
            Date: item.date,
            Status: item.status,
            Email: item.email,
            Phone: item.phone,
            Diagnosis: item.diagnosis,
            Prescription: item.prescription,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Patient Reports"
        );

        XLSX.writeFile(workbook, "PatientReports.xlsx");
    };

    // pagination 

    const totalPages = Math.ceil(
        filteredReports.length / itemsPerPage
    );

    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, startDate, endDate, itemsPerPage]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-5 md:p-6">

            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>


                    <h1 className="mt-1 text-3xl font-bold text-gray-950">
                        Patient Reports
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage and monitor all patient medical reports.
                    </p>

                </div>



                <button className="inline-flex items-center gap-2 px-5 py-3 button-gradient">
                    <FileText size={18} />
                    Generate Report
                </button>
            </div>

            {/* CARDS */}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                {[
                    {
                        label: "Total Reports",
                        value: totalReports,
                        icon: FileText,
                        color: "bg-blue-100 text-green-700",
                        filter: reportsFilter,
                        setFilter: setReportsFilter,
                    },
                    {
                        label: "Completed",
                        value: completedReports,
                        icon: ClipboardCheck,
                        color: "bg-emerald-100 text-emerald-700",
                        filter: completedFilter,
                        setFilter: setCompletedFilter,
                    },
                    {
                        label: "Pending",
                        value: pendingReports,
                        icon: CalendarDays,
                        color: "bg-orange-100 text-orange-700",
                        filter: pendingFilter,
                        setFilter: setPendingFilter,
                    },
                    {
                        label: "Critical",
                        value: criticalReports,
                        icon: Activity,
                        color: "bg-red-100 text-red-700",
                        filter: criticalFilter,
                        setFilter: setCriticalFilter,
                    },
                ].map((item) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={item.label}
                            className="rounded-3xl border border-white/40 bg-white/80 p-5 backdrop-blur-xl shadow-lg"
                        >

                            <div className="flex items-start justify-between gap-4">

                                {/* LEFT */}

                                <div className="flex-1">

                                    <p className="text-sm text-gray-500">
                                        {item.label}
                                    </p>

                                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                        {item.value}
                                    </h2>

                                    {/* MONTH YEAR FILTER */}

                                    <MonthYearFilter
                                        month={item.filter.month}
                                        year={item.filter.year}
                                        onMonthChange={(month) =>
                                            item.setFilter((prev: any) => ({
                                                ...prev,
                                                month,
                                            }))
                                        }
                                        onYearChange={(year) =>
                                            item.setFilter((prev: any) => ({
                                                ...prev,
                                                year,
                                            }))
                                        }
                                    />

                                </div>

                                {/* ICON */}

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

            <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">

                <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between px-6 py-5 border-b border-gray-100">

                    <div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            Latest Reports
                        </h2>

                        <p className="text-sm text-gray-500">
                            Recent patient report activities
                        </p>

                    </div>

                    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">

                        {/* SEARCH */}

                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-11 w-full sm:w-72 rounded-2xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                            />

                        </div>

                        {/* STATUS FILTER */}

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Critical">Critical</option>
                        </select>

                        {/* START DATE */}

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        />

                        {/* END DATE */}

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        />

                        {/* EXPORT BUTTON */}

                        <button
                            onClick={exportToExcel}
                            className="h-11 px-5 rounded-2xl bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 hover:bg-emerald-700 transition"
                        >
                            <Download size={18} />
                            Export Excel
                        </button>

                    </div>

                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[600px]">

                    <table className="w-full min-w-[1200px]">

                        <thead className="bg-gray-50/80 sticky top-0 z-10">

                            <tr className="text-left">

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Patient
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Doctor
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Department
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Report Type
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedReports.map((item, i) => (

                                <tr
                                    key={i}
                                    className="border-t border-gray-100 transition hover:bg-emerald-50/40"
                                >

                                    {/* PATIENT */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-green-700 ring-2 ring-white shadow-sm">
                                                <UserRound size={20} />
                                            </div>

                                            <div>

                                                <p className="font-semibold text-gray-900">
                                                    {item.patientName}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {item.id}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* DOCTOR */}

                                    <td className="px-6 py-5">

                                        <div>

                                            <p className="font-medium text-gray-900">
                                                {item.doctor}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item.department}
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

                                    {/* REPORT */}

                                    <td className="px-6 py-5">

                                        <span className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-green-700">
                                            {item.reportType}
                                        </span>

                                    </td>

                                    {/* DATE */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-2 text-gray-600">

                                            <CalendarDays size={16} />

                                            {item.date}

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

                                    {/* ACTIONS */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center justify-center gap-3">

                                            {/* VIEW */}

                                            <button
                                                onClick={() => setSelectedReport(item)}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-green-700 transition hover:bg-blue-100"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {/* DOWNLOAD */}

                                            <button
                                                onClick={() => handleDownload(item)}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                                            >
                                                <Download size={18} />
                                            </button>

                                            {/* MAIL */}

                                            <button
                                                onClick={() => handleMail(item)}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700 transition hover:bg-orange-100"
                                            >
                                                <Mail size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-t border-gray-100 px-6 py-5 bg-white">

                        {/* LEFT */}

                        <div className="flex items-center gap-3">

                            <p className="text-sm text-gray-500">
                                Showing{" "}
                                <span className="font-semibold text-gray-800">
                                    {(currentPage - 1) * itemsPerPage + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold text-gray-800">
                                    {Math.min(
                                        currentPage * itemsPerPage,
                                        filteredReports.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-800">
                                    {filteredReports.length}
                                </span>{" "}
                                reports
                            </p>

                            {/* PAGE SIZE */}

                            <select
                                value={itemsPerPage}
                                onChange={(e) =>
                                    setItemsPerPage(Number(e.target.value))
                                }
                                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
                            >
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>

                        </div>

                        {/* RIGHT */}

                        <div className="flex items-center gap-2">

                            {/* PREVIOUS */}

                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                                className={`h-10 px-4 rounded-xl text-sm font-medium transition ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    }`}
                            >
                                Previous
                            </button>

                            {/* PAGE NUMBERS */}

                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${currentPage === index + 1
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            {/* NEXT */}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                                className={`h-10 px-4 rounded-xl text-sm font-medium transition ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    }`}
                            >
                                Next
                            </button>

                        </div>

                    </div>
                </div>

            </div>

            {/* MODAL */}

            {selectedReport && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

                    <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">

                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center">
                                    <UserRound size={24} />
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        {selectedReport.patientName}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {selectedReport.id}
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => setSelectedReport(null)}
                                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* BODY */}

                        <div className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs text-gray-500 uppercase">
                                        Doctor
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 text-gray-900 font-semibold">
                                        <Hospital size={18} />
                                        {selectedReport.doctor}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs text-gray-500 uppercase">
                                        Department
                                    </p>

                                    <p className="mt-2 text-gray-900 font-semibold">
                                        {selectedReport.department}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs text-gray-500 uppercase">
                                        Phone
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 text-gray-900 font-semibold">
                                        <Phone size={18} />
                                        {selectedReport.phone}
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs text-gray-500 uppercase">
                                        Email
                                    </p>

                                    <p className="mt-2 text-gray-900 font-semibold break-all">
                                        {selectedReport.email}
                                    </p>
                                </div>

                            </div>

                            {/* REPORT DETAILS */}

                            <div className="rounded-3xl border border-gray-100 p-5">

                                <div className="flex items-center justify-between mb-5">

                                    <div>

                                        <h3 className="text-lg font-bold text-gray-900">
                                            Medical Report
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {selectedReport.reportType}
                                        </p>

                                    </div>

                                    <span
                                        className={`px-4 py-2 rounded-full text-xs font-semibold ${statusStyles[selectedReport.status]}`}
                                    >
                                        {selectedReport.status}
                                    </span>

                                </div>

                                <div className="space-y-5">

                                    <div>

                                        <p className="text-sm font-semibold text-gray-500 uppercase">
                                            Diagnosis
                                        </p>

                                        <p className="mt-2 text-gray-700 leading-relaxed">
                                            {selectedReport.diagnosis}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-gray-500 uppercase">
                                            Prescription
                                        </p>

                                        <p className="mt-2 text-gray-700 leading-relaxed">
                                            {selectedReport.prescription}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="border-t border-gray-100 px-6 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end">

                            <button
                                onClick={() => handleMail(selectedReport)}
                                className="h-11 px-5 rounded-2xl bg-orange-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
                            >
                                <Send size={18} />
                                Send Mail
                            </button>

                            <button
                                onClick={() => handleDownload(selectedReport)}
                                className="h-11 px-5 rounded-2xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                            >
                                <Download size={18} />
                                Download Report
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default PatientReports;