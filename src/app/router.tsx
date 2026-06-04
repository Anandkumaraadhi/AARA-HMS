import { createBrowserRouter } from "react-router-dom";
import Login from "@/features/auth/pages/Login";
import ProtectedLayout from "./ProtectedLayout";
import MainLayout from "@/layout/MainLayout";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import DoctorList from "@/features/doctors/doctorList";
import PatientList from "@/features/patients/components/PatientList";
import StaffDetails from "@/features/staffDetails/components/staffDetails";
import AttendeceDetails from "@/features/attendence/components/attendeceDetails";
import AppointmentsPage from "@/features/appointments/pages/AppointmentsPage";
import PatientReports from "@/features/patients/components/PatientReports";
import DoctorSchedule from "@/features/appointments/pages/doctorSchedule";
import BillingPage from "@/features/billing/pages/BillingPage";

// New Modules Imports
import Admissions from "@/features/patients/components/Admissions";
import Departments from "@/features/doctors/Departments";
import Invoices from "@/features/billing/components/Invoices";
import LabReports from "@/features/laboratory/LabReports";
import BloodTest from "@/features/laboratory/BloodTest";
import Rooms from "@/features/ward/Rooms";
import Beds from "@/features/ward/Beds";
import ReportsPage from "@/features/reports/ReportsPage";
import SettingsPage from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "/patients",
                        element: <PatientList />,
                    },
                    {
                        path: "/patient-reports",
                        element: <PatientReports />,
                    },
                    {
                        path: "/admissions",
                        element: <Admissions />,
                    },
                    {
                        path: "/doctor-schedule",
                        element: <DoctorSchedule />,
                    },
                    {
                        path: "/billing",
                        element: <BillingPage />,
                    },
                    {
                        path: "/invoices",
                        element: <Invoices />,
                    },
                    {
                        path: "/doctors",
                        element: <DoctorList />,
                    },
                    {
                        path: "/departments",
                        element: <Departments />,
                    },
                    {
                        path: "/staff",
                        element: <StaffDetails />,
                    },
                    {
                        path: "/attendance",
                        element: <AttendeceDetails />,
                    },
                    {
                        path: "/appointmentsDetails",
                        element: <AppointmentsPage />,
                    },
                    {
                        path: "/lab-reports",
                        element: <LabReports />,
                    },
                    {
                        path: "/blood-test",
                        element: <BloodTest />,
                    },
                    {
                        path: "/rooms",
                        element: <Rooms />,
                    },
                    {
                        path: "/beds",
                        element: <Beds />,
                    },
                    {
                        path: "/reports",
                        element: <ReportsPage />,
                    },
                    {
                        path: "/settings",
                        element: <SettingsPage />,
                    },
                ],
            },
        ],
    },
]);