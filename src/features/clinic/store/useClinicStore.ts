// features/clinic/store/useClinicStore.ts
import { create } from "zustand";

type Clinic = {
  id: string;
  name: string;
};

type ClinicState = {
  clinic: Clinic | null;
  setClinic: (clinic: Clinic) => void;
};

export const useClinicStore = create<ClinicState>((set) => ({
  clinic: null,
  setClinic: (clinic) => set({ clinic }),
}));