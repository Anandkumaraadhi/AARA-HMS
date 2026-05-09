// shared/api/axios.ts

import axios from "axios";

import type {
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/features/auth/store/useAuthStore";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

/* =========================================
   REQUEST INTERCEPTOR
========================================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const token = localStorage.getItem("token");

    const clinicId =
      useAuthStore.getState().user?.clinicId;

    /* AUTH TOKEN */
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    /* MULTI TENANT CLINIC ID */
    if (clinicId) {
      config.headers["x-clinic-id"] =
        clinicId;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default api;