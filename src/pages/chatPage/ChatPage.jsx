import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import ChatList from "../../components/Chat/ChatList";
import ChatBox from "../../components/Chat/ChatBox";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ChatPage = () => {
    const { user } = useAuth();
    const { chatId } = useParams();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        if (!user) return;

        const chatQuery = query(
            collection(firestore, "chats"),
            where("participants", "array-contains", user.uid)
        );

        const unsubscribe = onSnapshot(chatQuery, async (snapshot) => {
            const chatData = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const chat = { id: docSnap.id, ...docSnap.data() };

                // Find the other participant
                const otherUserId = chat.participants.find(id => id !== user.uid);

                // Fetch user details
                const userRef = doc(firestore, "users", otherUserId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    return {
                        ...chat,
                        participantName: userData.fullName,
                        participantProfile: userData.profilePicURL,
                    };
                }

                return chat;
            }));

            setChats(chatData);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (chatId) {
            const fetchChat = async () => {
                const chatRef = doc(firestore, "chats", chatId);
                const chatSnap = await getDoc(chatRef);

                if (chatSnap.exists()) {
                    const chatData = chatSnap.data();
                    const otherUserId = chatData.participants.find(id => id !== user.uid);

                    // Fetch user details
                    const userRef = doc(firestore, "users", otherUserId);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        setSelectedChat({
                            id: chatId,
                            ...chatData,
                            participantName: userSnap.data().fullName,
                            participantProfile: userSnap.data().profilePicURL,
                        });
                    }
                }
            };

            fetchChat();
        }
    }, [chatId]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <ChatList chats={chats} setSelectedChat={setSelectedChat} selectedChat={selectedChat}  />
            {selectedChat && (
                <ChatBox 
                    selectedChat={selectedChat} 
                    participantName={selectedChat?.participantName} 
                    participantProfile={selectedChat?.participantProfile} 
                    setSelectedChat={setSelectedChat}
                />
            )}
        </div>
    );
};

export default ChatPage;
