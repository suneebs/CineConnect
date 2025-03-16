import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import ChatList from "../../components/Chat/ChatList";
import ChatBox from "../../components/Chat/ChatBox";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ChatPage = () => {
    const { user } = useAuth();
    const { chatId } = useParams();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    // ✅ Fetch chats dynamically
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
                        unreadCount: chat.unreadCounts?.[user.uid] || 0, // ✅ Ensure unread count is always a number
                    };
                }

                return chat;
            }));

            console.log("Updated Chats:", chatData);
            setChats(chatData);
        });

        return () => unsubscribe();
    }, [user]);

    // ✅ Reset unread count when opening a chat
    const markMessagesAsRead = async (chatId) => {
        if (!chatId || !user) return;
    
        const chatRef = doc(firestore, "chats", chatId);
        const chatSnap = await getDoc(chatRef);
    
        if (!chatSnap.exists()) return;
    
        const chatData = chatSnap.data();
    
        if (chatData.unreadCounts?.[user.uid] > 0) {
            const newUnreadCounts = { ...chatData.unreadCounts, [user.uid]: 0 };
    
            await updateDoc(chatRef, {
                unreadCounts: newUnreadCounts, // 🔥 Reset unread count
            });
        }
    };
    
    useEffect(() => {
        if (chatId && user) {
            markMessagesAsRead(chatId);
        }
    }, [chatId, user]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <ChatList chats={chats} setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
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
