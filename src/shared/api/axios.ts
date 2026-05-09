// shared/api/axios.ts
import axios from "axios";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const clinicId = useAuthStore.getState().user?.clinicId;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (clinicId) config.headers["x-clinic-id"] = clinicId;

  return config;
});

export default api;