import { firestore } from "../firebase/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const useSendMessage = () => {
  const sendMessage = async (chatId, senderId, text) => {
    if (!chatId || !senderId || !text.trim()) return;

    const messageData = {
      senderId,
      text,
      timestamp: serverTimestamp(),
      seen: false,
    };

    // Add message to Firestore
    await addDoc(collection(firestore, "chats", chatId, "messages"), messageData);

    // Update lastMessage in chat document
    await updateDoc(doc(firestore, "chats", chatId), {
      lastMessage: text,
      timestamp: serverTimestamp(),
    });
  };

  return sendMessage;
};

export default useSendMessage;
