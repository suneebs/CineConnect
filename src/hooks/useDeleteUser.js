import { firestore, auth } from "../firebase/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import useAuthStore from "../store/authStore";
import { useToast } from "@chakra-ui/react";

const useDeleteUser = () => {
  const logout = useAuthStore((state) => state.logout);
  const toast = useToast();

  const deleteUserAccount = async (userId, navigate) => {
    if (!userId) return;

    try {
      // 1️⃣ Fetch all posts by the user
      const postsQuery = query(collection(firestore, "posts"), where("userId", "==", userId));
      const postsSnapshot = await getDocs(postsQuery);

      // 2️⃣ Delete each post
      const deletePromises = postsSnapshot.docs.map((postDoc) => deleteDoc(doc(firestore, "posts", postDoc.id)));
      await Promise.all(deletePromises);

      // 3️⃣ Delete user document from Firestore
      await deleteDoc(doc(firestore, "users", userId));

      // 4️⃣ Delete authentication account
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        await deleteUser(currentUser);
      }

      // 5️⃣ Log the user out and redirect
      logout();
      await signOut(auth);
      navigate("/");

    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Account Deletion Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { deleteUserAccount };
};

export default useDeleteUser;
