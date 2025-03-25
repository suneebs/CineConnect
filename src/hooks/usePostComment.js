import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { arrayUnion, doc, updateDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import usePostStore from "../store/postStore";

const usePostComment = () => {
	const [isCommenting, setIsCommenting] = useState(false);
	const showToast = useShowToast();
	const authUser = useAuthStore((state) => state.user);
	const addComment = usePostStore((state) => state.addComment);

	const handlePostComment = async (postId, comment) => {
		if (isCommenting) return;
		if (!authUser) return showToast("Error", "You must be logged in to comment", "error");
		if (!comment.trim()) return; // Prevent empty comments 

		setIsCommenting(true);

		const newComment = {
			comment,
			createdAt: Date.now(),
			createdBy: authUser.uid,
			postId,
		};

		try {
			// Add comment to Firestore
			await updateDoc(doc(firestore, "posts", postId), {
				comments: arrayUnion(newComment),
			});
			addComment(postId, newComment);

			// Fetch post owner details to send notification
			const postRef = doc(firestore, "posts", postId);
			const postSnap = await getDoc(postRef);

			if (postSnap.exists()) {
				const postOwnerId = postSnap.data().createdBy; // Assuming post has `createdBy`
				if (postOwnerId !== authUser.uid) { 
					// Send notification to post owner
					await addDoc(collection(firestore, "notifications"), {
						type: "comment",
						postId,
						receiverId: postOwnerId,
						senderId: authUser.uid,
						senderName: authUser.username,
						senderProfilePic: authUser.profilePicURL || "",
						commentText: comment,
						timestamp: new Date(),
						seen: false,
					});
				}
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsCommenting(false);
		}
	};

	return { isCommenting, handlePostComment };
};

export default usePostComment;
