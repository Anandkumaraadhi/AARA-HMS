import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import {
  Search,
  Plus,
  X,
  FileText,
  Download,
  Mail,
  Receipt,
  User,
  Clock,
  IndianRupee,
  Printer,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Pending" | "Unpaid" | "Overdue";

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id: string;
  patientName: string;
  patientEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number; // percentage
  status: InvoiceStatus;
};

type InvoiceForm = Omit<Invoice, "id" | "items"> & {
  itemsJSON: string;
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-2026-001",
    patientName: "Rahul Sharma",
    patientEmail: "rahul@email.com",
    date: "2026-05-20",
    dueDate: "2026-06-03",
    items: [
      { description: "Consultation Fee", quantity: 1, price: 800 },
      { description: "Dental X-Ray", quantity: 1, price: 1200 },
    ],
    taxRate: 5,
    status: "Paid",
  },
  {
    id: "INV-2026-002",
    patientName: "Priya Kapoor",
    patientEmail: "priya@email.com",
    date: "2026-05-18",
    dueDate: "2026-06-01",
    items: [
      { description: "Root Canal Treatment", quantity: 1, price: 3500 },
      { description: "Medications", quantity: 1, price: 500 },
    ],
    taxRate: 5,
    status: "Pending",
  },
  {
    id: "INV-2026-003",
    patientName: "Arjun Mehta",
    patientEmail: "arjun@email.com",
    date: "2026-05-15",
    dueDate: "2026-05-29",
    items: [{ description: "General Cleaning", quantity: 1, price: 1800 }],
    taxRate: 0,
    status: "Paid",
  },
];

const defaultForm: InvoiceForm = {
  patientName: "",
  patientEmail: "",
  date: "",
  dueDate: "",
  taxRate: 5,
  status: "Pending",
  itemsJSON: '[{"description":"Consultation Fee","quantity":1,"price":800}]',
};

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Unpaid: "bg-red-50 text-red-700 border-red-100",
  Overdue: "bg-purple-50 text-purple-700 border-purple-100",
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | InvoiceStatus>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<InvoiceForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const calculateTotal = (invoice: Invoice) => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const tax = subtotal * (invoice.taxRate / 100);
    return subtotal + tax;
  };

  const filteredInvoices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return invoices.filter((inv) => {
      const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
      const matchesSearch =
        !query ||
        [inv.id, inv.patientName, inv.patientEmail, inv.status].some((val) =>
          val.toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [invoices, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const paidSum = invoices
      .filter((i) => i.status === "Paid")
      .reduce((acc, curr) => acc + calculateTotal(curr), 0);
    const pendingSum = invoices
      .filter((i) => i.status === "Pending")
      .reduce((acc, curr) => acc + calculateTotal(curr), 0);
    const unpaidSum = invoices
      .filter((i) => i.status === "Unpaid" || i.status === "Overdue")
      .reduce((acc, curr) => acc + calculateTotal(curr), 0);

    return {
      paidSum,
      pendingSum,
      unpaidSum,
      totalCount: invoices.length,
    };
  }, [invoices]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "taxRate" ? parseFloat(value) || 0 : value,
    }));
  };

  const openAddModal = () => {
    setForm(defaultForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleDownload = (invoice: Invoice) => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const tax = subtotal * (invoice.taxRate / 100);
    const total = subtotal + tax;

    const content = `
========================================
           AARA CLINIC INVOICE
========================================
Invoice No:   ${invoice.id}
Date:         ${invoice.date}
Due Date:     ${invoice.dueDate}
Status:       ${invoice.status}

Patient Name: ${invoice.patientName}
Email:        ${invoice.patientEmail}

ITEMS:
${invoice.items
        .map(
          (item, index) =>
            `${index + 1}. ${item.description} (Qty: ${item.quantity}) - INR ${item.price}`
        )
        .join("\n")}

----------------------------------------
Subtotal:     INR ${subtotal.toFixed(2)}
Tax Rate:     ${invoice.taxRate}% (INR ${tax.toFixed(2)})
Grand Total:  INR ${total.toFixed(2)}
========================================
Thank you for visiting AARA.
`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${invoice.id}.txt`;
    link.click();
  };

  const handleMail = (invoice: Invoice) => {
    const total = calculateTotal(invoice);
    const subject = `Invoice ${invoice.id} from AARA HMS`;
    const body = `Dear ${invoice.patientName},\n\nPlease find the details of your invoice ${invoice.id} dated ${invoice.date}.\n\nTotal Due: INR ${total.toFixed(2)}\nDue Date: ${invoice.dueDate}\nStatus: ${invoice.status}\n\nRegards,\nAARA HMS Admin`;
    window.location.href = `mailto:${invoice.patientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let parsedItems: InvoiceItem[] = [];
    try {
      parsedItems = JSON.parse(form.itemsJSON);
    } catch (e) {
      alert("Invalid JSON format for billing items. Please use valid array format.");
      return;
    }

    const savedInvoice: Invoice = {
      patientName: form.patientName,
      patientEmail: form.patientEmail,
      date: form.date,
      dueDate: form.dueDate,
      taxRate: form.taxRate,
      status: form.status,
      items: parsedItems,
      id: editingId || `INV-2026-${Date.now().toString().slice(-3)}`,
    };

    if (editingId) {
      setInvoices((current) =>
        current.map((inv) => (inv.id === editingId ? savedInvoice : inv))
      );
    } else {
      setInvoices((current) => [savedInvoice, ...current]);
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
            Billing Section
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-950">
            Invoices Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and print patient billing invoices, payment statuses, and taxes.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Invoices",
            value: stats.totalCount,
            icon: Receipt,
            color: "bg-blue-100 text-green-700",
          },
          {
            label: "Paid Amount",
            value: `₹${stats.paidSum.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Pending Amount",
            value: `₹${stats.pendingSum.toLocaleString("en-IN")}`,
            icon: Clock,
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Unpaid / Overdue",
            value: `₹${stats.unpaidSum.toLocaleString("en-IN")}`,
            icon: FileText,
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
                  <p className="mt-1 text-xl font-bold text-gray-950">
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
              Invoices List
            </h2>
            <p className="text-sm text-gray-500">
              {filteredInvoices.length} invoice
              {filteredInvoices.length === 1 ? "" : "s"} found
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
                placeholder="Search by Patient, ID, or Status..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | InvoiceStatus)}
              className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-4">Invoice ID</th>
                    <th className="px-5 py-4">Patient Details</th>
                    <th className="px-5 py-4">Invoice Date</th>
                    <th className="px-5 py-4">Due Date</th>
                    <th className="px-5 py-4">Grand Total</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((inv) => {
                    const total = calculateTotal(inv);
                    return (
                      <tr key={inv.id} className="transition hover:bg-slate-50/50">
                        <td className="px-5 py-4 text-sm font-semibold text-gray-950">
                          {inv.id}
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-950">
                              {inv.patientName}
                            </p>
                            <p className="text-xs text-gray-500">{inv.patientEmail}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {inv.date}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {inv.dueDate}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-950">
                          ₹{total.toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${statusStyles[inv.status]
                              }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-green-700 transition hover:bg-blue-100"
                              title="View details"
                            >
                              <User size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownload(inv)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              title="Download TXT"
                            >
                              <Download size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMail(inv)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-purple-100 bg-purple-50 text-purple-700 transition hover:bg-purple-100"
                              title="Send Email"
                            >
                              <Mail size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMail(inv)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-yellow-100 bg-yellow-50 text-yellow-700 transition hover:bg-purple-100"
                              title="Print Invoice"
                            >
                              <Printer size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
              No invoices found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  Invoice {selectedInvoice.id}
                </h2>
                <p className="text-xs text-gray-500">
                  Detailed billing line-items breakdown.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Patient Name</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedInvoice.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedInvoice.patientEmail}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Billing Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedInvoice.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedInvoice.dueDate}
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-950">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 border-t border-gray-100 pt-3 flex flex-col items-end text-sm">
                <div className="flex gap-4">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    ₹
                    {selectedInvoice.items
                      .reduce((sum, i) => sum + i.quantity * i.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500">Tax ({selectedInvoice.taxRate}%):</span>
                  <span className="font-medium text-gray-900">
                    ₹
                    {(
                      selectedInvoice.items.reduce(
                        (sum, i) => sum + i.quantity * i.price,
                        0
                      ) *
                      (selectedInvoice.taxRate / 100)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-4 text-base font-bold">
                  <span className="text-gray-950">Grand Total:</span>
                  <span className="text-green-600">
                    ₹{calculateTotal(selectedInvoice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="h-10 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDownload(selectedInvoice)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Download size={15} />
                Download Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-950">
                  {editingId ? "Edit Invoice" : "Create Invoice"}
                </h2>
                <p className="text-sm text-gray-500">
                  Form patient details and invoice item arrays in JSON.
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
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Patient Email <span className="text-red-500">*</span>
                  </span>
                  <input
                    required
                    type="email"
                    name="patientEmail"
                    value={form.patientEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. patient@email.com"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Invoice Date <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>

                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Due Date <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleInputChange}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-blue-400"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="space-y-1.5 block">
                    <span className="text-xs font-semibold text-gray-700">
                      Tax Rate (%) <span className="text-red-500">*</span>
                    </span>
                    <input
                      required
                      type="number"
                      name="taxRate"
                      value={form.taxRate}
                      onChange={handleInputChange}
                      min="0"
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
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-semibold text-gray-700">
                    Billing Items (JSON Format) <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    required
                    name="itemsJSON"
                    value={form.itemsJSON}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder='[{"description":"Consultation","quantity":1,"price":800}]'
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono outline-none transition focus:border-blue-400 focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400">
                    Must be a valid JSON array of objects with description, quantity, and price.
                  </span>
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
                  {editingId ? "Update Invoice" : "Save Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
