import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";

const useFetchChats = () => {
  const authUser = useAuthStore((state) => state.user);
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    if (!authUser) return;

    const q = query(collection(firestore, "chats"), orderBy("lastMessageTime", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = snapshot.docs.map(doc => {
        const chatData = doc.data();
        const lastMessage = chatData.lastMessage || "";
        const lastMessageTime = chatData.lastMessageTime || "";
        const unreadCount = chatData.unreadMessages?.[authUser.uid] || 0;

        return {
          id: doc.id,
          ...chatData,
          lastMessage,
          lastMessageTime,
          unreadCount,
        };
      });

      setChatUsers(fetchedChats);
    });

    return () => unsubscribe();
  }, [authUser]);

  return { chatUsers };
};

export default useFetchChats;
