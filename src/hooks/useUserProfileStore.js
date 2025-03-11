import { create } from "zustand";
import { firestore } from "../firebase/firebase.js"; 
import { doc, getDoc } from "firebase/firestore";

const useUserProfileStore = create((set) => ({
  userProfile: null,
  fetchUserProfile: async (uid) => {
    if (!uid) return; // Prevent unnecessary fetching

    try {
      const userDoc = await getDoc(doc(firestore, "users", uid));
      if (userDoc.exists()) {
        set({ userProfile: { ...userDoc.data(), uid: userDoc.id } });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  },
}));

export default useUserProfileStore;
