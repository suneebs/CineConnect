import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import ChatList from "../../components/Chat/ChatList";
import ChatBox from "../../components/Chat/ChatBox";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Box, Text, Flex, useBreakpointValue } from "@chakra-ui/react";

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
                        participantName: userData.username,
                        participantProfile: userData.profilePicURL,
                        unreadCount: chat.unreadCounts?.[user.uid] || 0, // ✅ Ensure unread count is always a number
                    };
                }

                return chat;
            }));

            setChats(chatData);

            // ✅ Auto-select chat if chatId is in URL
            if (chatId) {
                const selected = chatData.find(chat => chat.id === chatId);
                if (selected) setSelectedChat(selected);
            }
        });

        return () => unsubscribe();
    }, [user, chatId]);

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

    // ✅ Responsive Logic: Show only ChatList or ChatBox in mobile
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Flex h="100vh">
            {/* Mobile: Show only ChatList OR ChatBox */}
            {isMobile ? (
                selectedChat ? (
                    <Box w="100%" bg="gray.900">
                        <ChatBox
                            selectedChat={selectedChat}
                            participantName={selectedChat?.participantName}
                            participantProfile={selectedChat?.participantProfile}
                            setSelectedChat={setSelectedChat} // Allows going back to chat list
                        />
                    </Box>
                ) : (
                    <Box w="100%" borderRight="1px solid gray">
                        <ChatList chats={chats} setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
                    </Box>
                )
            ) : (
                // Desktop: Show both ChatList & ChatBox side by side
                <>
                    <Box w="35%" borderRight="1px solid gray">
                        <ChatList chats={chats} setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
                    </Box>

                    <Box w="65%" display="flex" alignItems="center" justifyContent="center">
                        {selectedChat ? (
                            <ChatBox
                                selectedChat={selectedChat}
                                participantName={selectedChat?.participantName}
                                participantProfile={selectedChat?.participantProfile}
                                setSelectedChat={setSelectedChat}
                            />
                        ) : (
                            <Text fontSize="lg" color="gray.400">
                                Select a chat to start a conversation
                            </Text>
                        )}
                    </Box>
                </>
            )}
        </Flex>
    );
};

export default ChatPage;
