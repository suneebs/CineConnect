import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase/firebase";
import {
    collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, updateDoc, doc, getDoc
} from "firebase/firestore";
import {
    Box, VStack, HStack, Input, IconButton, Text, Avatar, Flex
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { ArrowBackIcon } from "@chakra-ui/icons";
import useAuth from "../../hooks/useAuth";
import { format, isToday, isYesterday } from "date-fns";

const ChatBox = ({ selectedChat, participantName, participantProfile, setSelectedChat }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");  // ✅ Fixed state
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!selectedChat || !user) return;

        const chatRef = doc(firestore, "chats", selectedChat.id);
        updateDoc(chatRef, { [`unseenMessages.${user.uid}`]: 0 }); // ✅ Mark messages as seen

        const messagesRef = collection(firestore, "chats", selectedChat.id, "messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "instant" });  // 🔥 Instant Scroll (No Smooth)
            }, 100);        });

        return () => unsubscribe();
    }, [selectedChat, user]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;  // ✅ Prevent empty messages

        console.log("Sending message:", newMessage); // ✅ Debugging line

        if (!selectedChat || !user) {
            console.error("No selected chat or user!");
            return;
        }

        try {
            const chatRef = doc(firestore, "chats", selectedChat.id);
            const chatSnap = await getDoc(chatRef);

            if (!chatSnap.exists()) {
                console.error("Chat document does not exist!");
                return;
            }

            const chatData = chatSnap.data();
            const otherUserId = chatData.participants.find(id => id !== user.uid);

            const newUnreadCounts = { ...chatData.unreadCounts };
            newUnreadCounts[otherUserId] = (newUnreadCounts[otherUserId] || 0) + 1;

            await addDoc(collection(firestore, "chats", selectedChat.id, "messages"), {
                sender: user.uid,
                message: newMessage.trim(),
                timestamp: serverTimestamp(),
            });

            await updateDoc(chatRef, {
                lastMessage: newMessage.trim(),
                lastMessageTimestamp: serverTimestamp(),
                unreadCounts: newUnreadCounts,
            });

            setNewMessage("");  // ✅ Clear input after sending
            console.log("Message sent successfully! ✅");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const groupMessagesByDate = () => {
        const groupedMessages = {};
        messages.forEach((msg) => {
            const date = msg.timestamp?.toDate() || new Date();
            let formattedDate = isToday(date)
                ? "Today"
                : isYesterday(date)
                ? "Yesterday"
                : format(date, "PP");

            if (!groupedMessages[formattedDate]) {
                groupedMessages[formattedDate] = [];
            }
            groupedMessages[formattedDate].push(msg);
        });
        return groupedMessages;
    };

    const groupedMessages = groupMessagesByDate();

    return (
        <Flex flexDir="column" h="100%" w="100%" bg="gray.900" borderRadius="md" boxShadow="lg">
            <HStack p={2} bg="gray.800" borderRadius="md" boxShadow="sm">
                <IconButton icon={<ArrowBackIcon />} onClick={() => setSelectedChat(null)} aria-label="Back" />
                <Avatar src={participantProfile} name={participantName} boxSize={8} />
                <Text fontWeight="bold" color="white">{participantName}</Text>
            </HStack>

            <VStack flex="1" overflowY="auto" p={4} spacing={4} align="stretch">
                {Object.keys(groupedMessages).map((date) => (
                    <VStack key={date} align="stretch">
                        <Text align="center" color="gray.400" fontSize="sm" fontWeight="bold" my={2}>{date}</Text>
                        {groupedMessages[date].map((msg) => (
                            <VStack
                                key={msg.id}
                                alignSelf={msg.sender === user.uid ? "flex-end" : "flex-start"}
                                p={2}
                                borderRadius="lg"
                                bg={msg.sender === user.uid ? "blue.500" : "gray.700"}
                                color="white"
                                maxW="75%"
                                minW="15%"
                                spacing={1}
                                alignItems="start"
                            >
                                <Text>{msg.message}</Text>
                                {msg.timestamp && (
                                    <Text fontSize="0.65rem" color="gray.300" alignSelf="flex-end">
                                        {format(msg.timestamp.toDate(), "hh:mm a")}
                                    </Text>
                                )}
                            </VStack>
                        ))}
                    </VStack>
                ))}
                <div ref={messagesEndRef} />
            </VStack>

            <HStack p={4} bg="gray.800" borderRadius="md" boxShadow="sm">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                />
                <IconButton
                    icon={<FiSend />}
                    onClick={sendMessage} // ✅ Directly calls function
                    colorScheme="blue"
                    aria-label="Send"
                />
            </HStack>
        </Flex>
    );
};

export default ChatBox;
