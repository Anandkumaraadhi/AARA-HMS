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
                        path: "/doctors",
                        element: <DoctorList />,
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
                ],
            },
        ],
    },
]);