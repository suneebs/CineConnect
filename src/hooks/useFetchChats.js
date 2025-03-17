import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const useFetchChats = (currentUserId) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(firestore, "chats"),
      where("users", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          unseenMessages: data.unseenMessages?.[currentUserId] || 0, // Fetch unseen messages for current user
        };
      });

      setChats(chatData);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  return chats;
};

export default useFetchChats;
