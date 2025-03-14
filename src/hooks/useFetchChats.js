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
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  return chats;
};

export default useFetchChats;
