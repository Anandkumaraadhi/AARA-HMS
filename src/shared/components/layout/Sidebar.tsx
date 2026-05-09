import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Stethoscope,
    Receipt,
    BarChart3,
    Settings,
    Building2,
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    Bed,
    Pill,
    FileText,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export const menuItems = [
    {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },

    {
        name: "Patients",
        icon: Users,
        children: [
            { name: "Patients List", path: "/patients" },
            { name: "Patient Reports", path: "/patient-reports" },
            { name: "Admissions", path: "/admissions" },
        ],
    },

    {
        name: "Appointments",
        icon: Calendar,
        children: [
            { name: "Appointments List", path: "/appointmentsDetails" },
            { name: "Doctor Schedule", path: "/doctor-schedule" },
        ],
    },

    {
        name: "Doctors",
        icon: Stethoscope,
        children: [
            { name: "Doctors List", path: "/doctors" },
            { name: "Departments", path: "/departments" },
        ],
    },

    {
        name: "Billing",
        icon: Receipt,
        children: [
            { name: "Billing Details", path: "/billing" },
            { name: "Invoices", path: "/invoices" },
        ],
    },

    {
        name: "Laboratory",
        icon: FileText,
        children: [
            { name: "Lab Reports", path: "/lab-reports" },
            { name: "Blood Test", path: "/blood-test" },
        ],
    },

    {
        name: "Pharmacy",
        icon: Pill,
        children: [
            { name: "Medicines", path: "/medicines" },
            { name: "Inventory", path: "/inventory" },
        ],
    },

    {
        name: "Ward Management",
        icon: Bed,
        children: [
            { name: "Rooms", path: "/rooms" },
            { name: "Beds", path: "/beds" },
        ],
    },

    {
        name: "Reports",
        path: "/reports",
        icon: BarChart3,
    },

    {
        name: "Staff",
        icon: Users,
        children: [
            { name: "Staff List", path: "/staff" },
            { name: "Attendance", path: "/attendance" },
        ],
    },

    {
        name: "Dental",
        path: "/dental",
        icon: Stethoscope,
    },

    {
        name: "Clinics",
        path: "/clinics",
        icon: Building2,
    },

    {
        name: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const [openMenus, setOpenMenus] = useState<any>({
        Patients: true,
        Appointments: false,
    });

    const toggleMenu = (name: string) => {
        setOpenMenus((prev: any) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    return (
        <div
            className={`h-screen bg-[#1a222e] text-gray-300 flex flex-col transition-all duration-300 ${
                collapsed ? "w-20" : "w-72"
            }`}
        >
            {/* Logo */}
            <div
                className={`p-4 border-b border-gray-700 flex items-center ${
                    collapsed ? "justify-center" : "justify-start"
                }`}
            >
                {!collapsed ? (
                    <img
                        src="/aara_saas_logo.png"
                        alt="AARA"
                        className="object-contain"
                    />
                ) : (
                    <img
                        src="/aara_icon.png"
                        alt="AARA"
                        className="object-contain w-10"
                    />
                )}
            </div>

            {/* Menu */}
            <nav className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-2">

                    {menuItems.map((item: any) => {
                        const Icon = item.icon;

                        // Dropdown Menu
                        if (item.children) {
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition`}
                                    >
                                        <div
                                            className={`flex items-center ${
                                                collapsed
                                                    ? "justify-center w-full"
                                                    : "gap-3"
                                            }`}
                                        >
                                            <Icon size={18} />

                                            {!collapsed && (
                                                <span className="text-sm font-medium">
                                                    {item.name}
                                                </span>
                                            )}
                                        </div>

                                        {!collapsed && (
                                            <>
                                                {openMenus[item.name] ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {/* Sub Menu */}
                                    {!collapsed && openMenus[item.name] && (
                                        <div className="ml-8 mt-2 space-y-1">
                                            {item.children.map(
                                                (child: any) => (
                                                    <NavLink
                                                        key={child.name}
                                                        to={child.path}
                                                        className={({
                                                            isActive,
                                                        }: {
                                                            isActive: boolean;
                                                        }) =>
                                                            `block px-3 py-2 rounded-md text-sm transition ${
                                                                isActive
                                                                    ? "bg-blue-600 text-white"
                                                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                                            }`
                                                        }
                                                    >
                                                        {child.name}
                                                    </NavLink>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Normal Menu
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center ${
                                        collapsed
                                            ? "justify-center"
                                            : "gap-3"
                                    } px-3 py-2 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={18} />

                                {!collapsed && (
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Collapse */}
            <div className="border-t border-gray-700 p-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`w-full flex items-center ${
                        collapsed
                            ? "justify-center"
                            : "justify-start gap-2"
                    } px-3 py-2 rounded-md hover:bg-gray-800 transition`}
                >
                    <ChevronLeft
                        className={`w-4 h-4 transition-transform ${
                            collapsed ? "rotate-180" : ""
                        }`}
                    />

                    {!collapsed && (
                        <span className="text-sm">
                            Collapse
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}