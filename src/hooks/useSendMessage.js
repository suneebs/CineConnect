import { firestore } from "../firebase/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";

const useSendMessage = () => {
  const sendMessage = async (chatId, senderId, receiverId, text) => {
    if (!chatId || !senderId || !receiverId || !text.trim()) return;

    const messageData = {
      senderId,
      text,
      timestamp: serverTimestamp(),
      seen: false,
    };

    // Add message to Firestore
    await addDoc(collection(firestore, "chats", chatId, "messages"), messageData);

    // Update chat metadata (lastMessage, unreadCounts)
    await updateDoc(doc(firestore, "chats", chatId), {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
      [`unreadCounts.${receiverId}`]: increment(1), // Increase unread count for receiver
    });
  };

  return sendMessage;
};

export default useSendMessage;
