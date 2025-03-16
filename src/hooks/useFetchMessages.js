import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useFetchMessages = (chatId, currentUserId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(firestore, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);

      // ✅ Mark all unseen messages as seen
      const unseenMessages = messagesData.filter(msg => !msg.seen && msg.senderId !== currentUserId);
      for (const message of unseenMessages) {
        await updateDoc(doc(firestore, "chats", chatId, "messages", message.id), { seen: true });
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  return messages;
};

export default useFetchMessages;
