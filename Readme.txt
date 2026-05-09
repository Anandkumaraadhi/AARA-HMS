src/
│
├── app/                         # Core app setup
│   ├── router.tsx              # Routes (with protection)
│   ├── providers.tsx           # Global providers (Zustand, etc.)
│   └── config.ts               # App config (env, constants)
│
├── features/                   # Feature-based modules
│
│   ├── auth/
│   │   ├── pages/
│   │   │     └── Login.tsx
│   │   ├── store/
│   │   │     └── useAuthStore.ts
│   │   ├── api/
│   │   │     └── authApi.ts
│   │   └── types.ts
│
│   ├── clinic/                 # 🔥 MULTI-CLINIC CORE
│   │   ├── store/
│   │   │     └── useClinicStore.ts
│   │   ├── components/
│   │   │     └── ClinicSwitcher.tsx
│   │   └── types.ts
│
│   ├── patients/
│   │   ├── pages/
│   │   │     └── PatientsPage.tsx
│   │   ├── components/
│   │   │     ├── PatientForm.tsx
│   │   │     └── PatientList.tsx
│   │   ├── api/
│   │   │     └── patientApi.ts
│   │   └── types.ts
│
│   ├── appointments/
│   │   ├── pages/
│   │   │     └── AppointmentsPage.tsx
│   │   ├── api/
│   │   │     └── appointmentApi.ts
│   │
│   ├── dental/
│   │   ├── pages/
│   │   │     └── DentalChartPage.tsx
│   │   ├── components/
│   │   │     ├── ToothCard.tsx
│   │   │     └── TreatmentModal.tsx
│   │   ├── api/
│   │   │     └── dentalApi.ts
│   │
│   ├── billing/
│   │   ├── pages/
│   │   │     └── BillingPage.tsx
│   │   ├── api/
│   │   │     └── billingApi.ts
│
│   └── users/                  # Roles (admin, doctor, receptionist)
│         ├── pages/
│         ├── api/
│
├── shared/                     # Reusable across features
│
│   ├── api/
│   │     └── axios.ts         # Global API instance
│   │
│   ├── components/
│   │     ├── ui/              # Buttons, inputs, modals
│   │     ├── layout/
│   │     │     ├── Sidebar.tsx
│   │     │     ├── Navbar.tsx
│   │     │     └── Header.tsx
│   │
│   ├── hooks/
│   │     ├── useAuth.ts
│   │     ├── useClinic.ts
│   │
│   ├── utils/
│   │     ├── formatDate.ts
│   │     ├── constants.ts
│   │
│   ├── types/
│   │     └── global.ts
│
├── layout/
│   └── MainLayout.tsx         # Sidebar + Header wrapper
│
├── styles/
│   └── index.css              # Tailwind entry
│
├── App.tsx
├── main.tsx












Dashboard

Patients
 ├ Registration
 ├ Patient List
 ├ EMR
 └ Emergency

Appointments
 ├ Calendar
 ├ Queue
 └ Telemedicine

Doctors
 ├ Doctors List
 ├ Schedule
 └ Availability

OPD / IPD
 ├ OPD
 ├ IPD
 ├ Wards
 └ Beds

Billing
 ├ Invoices
 ├ Payments
 ├ Insurance
 └ Expenses

Pharmacy
 ├ Medicines
 ├ Inventory
 └ Billing

Laboratory
 ├ Tests
 ├ Reports
 └ Radiology

Staff & HR
 ├ Employees
 ├ Attendance
 ├ Payroll
 └ Leaves

Reports & Analytics

AI Assistant
 ├ AI Chatbot
 ├ AI Summary
 └ AI Insights

Settings