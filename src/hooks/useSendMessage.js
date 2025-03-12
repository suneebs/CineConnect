import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSendMessage = () => {
  const sendMessage = async (chatId, senderId, receiverId, text) => {
    if (!text.trim()) return;

    const chatRef = doc(firestore, "chats", chatId);
    const messageRef = doc(firestore, `chats/${chatId}/messages`, Date.now().toString());

    await setDoc(messageRef, {
      senderId,
      text,
      timestamp: serverTimestamp(),
      seen: false,
    });

    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTime: serverTimestamp(),
      unreadMessages: { [receiverId]: (chatRef.unreadMessages?.[receiverId] || 0) + 1 },
    });
  };

  return { sendMessage };
};

export default useSendMessage;
