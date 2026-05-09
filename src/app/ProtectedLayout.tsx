import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export default function ProtectedLayout() {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}