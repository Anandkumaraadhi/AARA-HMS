import { useMemo, useState } from "react";
import {
    CalendarDays,
    Download,
    Eye,
    Mail,
    Search,
} from "lucide-react";

type Billing = {
    id: string;
    patient: string;
    email: string;
    amount: string;
    date: string;
    status: string;
};

const billingData = [
    {
        id: "INV-1001",
        patient: "Rahul Sharma",
        email: "rahul@gmail.com",
        amount: "₹2,500",
        date: "2026-05-20",
        status: "Paid",
    },
    {
        id: "INV-1002",
        patient: "Priya Kapoor",
        email: "priya@gmail.com",
        amount: "₹4,200",
        date: "2026-05-18",
        status: "Pending",
    },
    {
        id: "INV-1003",
        patient: "Arjun Mehta",
        email: "arjun@gmail.com",
        amount: "₹1,800",
        date: "2026-05-15",
        status: "Paid",
    },
];

function BillingPage() {
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const filteredBills = useMemo(() => {
        return billingData.filter((bill) => {
            const matchesSearch =
                bill.patient.toLowerCase().includes(search.toLowerCase()) ||
                bill.id.toLowerCase().includes(search.toLowerCase());

            const matchesDate = selectedDate
                ? bill.date === selectedDate
                : true;

            return matchesSearch && matchesDate;
        });
    }, [search, selectedDate]);


    // ADD THESE FUNCTIONS INSIDE COMPONENT
    const [selectedBill, setSelectedBill] = useState<Billing | null>(null);

    const handleViewBill = (bill: Billing) => {
        setSelectedBill(bill);
    };

    const closeBillModal = () => {
        setSelectedBill(null);
    };

    const handleDownloadBill = (bill: Billing) => {
        const content = `
            Invoice ID: ${bill.id}
            Patient: ${bill.patient}
            Email: ${bill.email}
            Amount: ${bill.amount}
            Date: ${bill.date}
            Status: ${bill.status}
            `;

        const blob = new Blob([content], { type: "text/plain" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${bill.id}.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAllBills = () => {
        const allBills = filteredBills
            .map(
                (bill) => `
            Invoice ID: ${bill.id}
            Patient: ${bill.patient}
            Email: ${bill.email}
            Amount: ${bill.amount}
            Date: ${bill.date}
            Status: ${bill.status}
            -----------------------------
            `
            )
            .join("\n");

        const blob = new Blob([allBills], {
            type: "text/plain",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "All_Bills.txt";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSendMail = (bill: Billing) => {
        window.location.href = `mailto:${bill.email}?subject=Invoice ${bill.id}&body=Dear ${bill.patient},
  
            Please find your invoice details.

            Invoice: ${bill.id}
            Amount: ${bill.amount}
            Date: ${bill.date}`;
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Billing Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage invoices, payments, downloads, and email sharing.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search invoice or patient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>
            </div>


            <div className="mb-4 flex justify-end">
                <button
                    onClick={handleDownloadAllBills}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    <Download size={16} />
                    Download All
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="px-5 py-4">Invoice ID</th>
                                <th className="px-5 py-4">Patient</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Amount</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredBills.map((bill) => (
                                <tr
                                    key={bill.id}
                                    className="transition hover:bg-blue-50/40"
                                >
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                        {bill.id}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-700">
                                        {bill.patient}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {bill.email}
                                    </td>

                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                        {bill.amount}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {bill.date}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bill.status === "Paid"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {bill.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">

                                            {/* View */}
                                            <button
                                                onClick={() => handleViewBill(bill)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 transition hover:bg-blue-100"
                                                title="View Bill"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {/* Download */}
                                            <button
                                                onClick={() => handleDownloadBill(bill)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                                                title="Download Bill"
                                            >
                                                <Download size={16} />
                                            </button>

                                            {/* Send Mail */}
                                            <button
                                                onClick={() => handleSendMail(bill)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-yellow-100 bg-yellow-50 text-yellow-700 transition hover:bg-yellow-100"
                                                title="Send Email"
                                            >
                                                <Mail size={16} />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedBill && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Invoice Details
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Complete billing information
                                        </p>
                                    </div>

                                    <button
                                        onClick={closeBillModal}
                                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="space-y-5 px-6 py-6">

                                    <div className="grid grid-cols-2 gap-4">

                                        <div className="rounded-2xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium text-gray-500">
                                                Invoice ID
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                                {selectedBill.id}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium text-gray-500">
                                                Amount
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-emerald-600">
                                                {selectedBill.amount}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium text-gray-500">
                                                Patient Name
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                                {selectedBill.patient}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-gray-50 p-4">
                                            <p className="text-xs font-medium text-gray-500">
                                                Billing Date
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                                {selectedBill.date}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="rounded-2xl bg-blue-50 p-4">
                                        <p className="text-xs font-medium text-blue-500">
                                            Email Address
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-blue-900">
                                            {selectedBill.email}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                                        <span className="text-sm font-medium text-gray-600">
                                            Payment Status
                                        </span>

                                        <span
                                            className={`inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${selectedBill.status === "Paid"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {selectedBill.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
                                    <button
                                        onClick={closeBillModal}
                                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                        Close
                                    </button>

                                    <button
                                        onClick={() => handleDownloadBill(selectedBill)}
                                        className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {filteredBills.length === 0 && (
                    <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                        No billing records found.
                    </div>
                )}
            </div>
        </div>



    );
}

export default BillingPage;