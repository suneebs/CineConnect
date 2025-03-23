import { create } from "zustand";

export const useSidebarStore = create((set) => ({
    showNotifications: false,
    setShowNotifications: (value) => set({ showNotifications: value }),
}));
