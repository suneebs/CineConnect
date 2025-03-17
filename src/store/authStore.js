import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-info")) || null, // Avoid undefined issues
  login: (user) => {
    localStorage.setItem("user-info", JSON.stringify(user)); // Store user on login
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user-info"); // Clear on logout
    set({ user: null });
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user-info", JSON.stringify(user)); // Update localStorage
    } else {
      localStorage.removeItem("user-info"); // Clear when user is null
    }
    set({ user });
  },
}));

export default useAuthStore;
