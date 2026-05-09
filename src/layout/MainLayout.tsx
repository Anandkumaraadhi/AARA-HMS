import Sidebar from "@/shared/components/layout/Sidebar";
import Navbar from "@/shared/components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}