import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";

const useFollowUser = (userId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const showToast = useShowToast();

  const handleFollowUser = async () => {
    if (!authUser || !userId) return;

    setIsUpdating(true);
    try {
      const currentUserRef = doc(firestore, "users", authUser.uid);
      const userToFollowRef = doc(firestore, "users", userId);

      await updateDoc(currentUserRef, {
        following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
      });

      await updateDoc(userToFollowRef, {
        followers: isFollowing ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
      });

      // ✅ Fetch updated user data from Firestore to avoid local desync
      const updatedAuthUserSnap = await getDoc(currentUserRef);
      if (updatedAuthUserSnap.exists()) {
        const updatedAuthUser = updatedAuthUserSnap.data();
        setAuthUser(updatedAuthUser);
        localStorage.setItem("user-info", JSON.stringify(updatedAuthUser));
      }

      if (userProfile) {
        const updatedFollowers = isFollowing
          ? userProfile.followers.filter((uid) => uid !== authUser.uid)
          : [...userProfile.followers, authUser.uid];

        setUserProfile({
          ...userProfile,
          followers: updatedFollowers,
        });
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      setIsFollowing(authUser.following.includes(userId));
    }
  }, [authUser, userId]);

  return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;
