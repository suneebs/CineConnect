import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useSendNotification from "./useSendNotification";
import { arrayRemove, arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useLikePost = (post) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
  const showToast = useShowToast();
  const sendNotification = useSendNotification();

  const handleLikePost = async () => {
    if (isUpdating) return;
    if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");

    setIsUpdating(true);

    try {
      const postRef = doc(firestore, "posts", post.id);
      const isNowLiked = !isLiked;

      await updateDoc(postRef, {
        likes: isNowLiked ? arrayUnion(authUser.uid) : arrayRemove(authUser.uid),
      });

      setIsLiked(isNowLiked);
      isNowLiked ? setLikes(likes + 1) : setLikes(likes - 1);

      // ✅ Fetch the post data to get `createdBy`
      const postSnapshot = await getDoc(postRef);
      const postData = postSnapshot.data();

      // ✅ Use `createdBy` instead of `userId`
      if (isNowLiked && postData?.createdBy && authUser.uid !== postData.createdBy) {
        await sendNotification(postData.createdBy, "like", {
          uid: authUser.uid,
          username: authUser.username,
          profilePic: authUser.profilePicURL || "",
        });
      }

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;
