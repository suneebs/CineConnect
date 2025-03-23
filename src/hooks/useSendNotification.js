import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSendNotification = () => {
  const sendNotification = async (receiverId, type, senderInfo) => {
    if (!receiverId || !type || !senderInfo) return;

    try {
      const notificationsRef = collection(firestore, "notifications");

      let message = "";
      if (type === "follow") {
        message = "started following you";
      } else if (type === "like") {
        message = "liked your post";
      } else {
        return; // Ignore unknown notification types
      }

      await addDoc(notificationsRef, {
        receiverId, // The user who gets notified
        senderId: senderInfo.uid, // The user who triggered the action
        senderName: senderInfo.username, // Username for UI display
        senderProfilePic: senderInfo.profilePic || "", // Optional profile pic
        type, // "follow", "like", etc.
        message, // ✅ Correct message for each notification type
        timestamp: serverTimestamp(), // Order notifications by time
        seen: false, // Mark as unread initially
      });

    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return sendNotification;
};

export default useSendNotification;
