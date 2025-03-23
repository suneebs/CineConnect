import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase/firebase";
import {
    collection, addDoc, orderBy, query, onSnapshot, serverTimestamp,
    updateDoc, doc, getDoc, deleteDoc, getDocs, writeBatch
} from "firebase/firestore";
import {
    Box, VStack, HStack, Input, IconButton, Text, Avatar, Flex,
    Menu, MenuButton, MenuList, MenuItem, useToast
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import { format, isToday, isYesterday } from "date-fns";
import { Link } from "react-router-dom";

const ChatBox = ({ selectedChat, participantName, participantProfile, setSelectedChat }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        if (!selectedChat || !user) return;

        const chatRef = doc(firestore, "chats", selectedChat.id);
        updateDoc(chatRef, { [`unseenMessages.${user.uid}`]: 0 });

        const messagesRef = collection(firestore, "chats", selectedChat.id, "messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
            }, 100);
        });

        return () => unsubscribe();
    }, [selectedChat, user]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

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

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const clearChat = async () => {
        if (!selectedChat || !user) return;

        try {
            const messagesRef = collection(firestore, "chats", selectedChat.id, "messages");
            const messagesSnapshot = await getDocs(messagesRef);

            const batch = writeBatch(firestore);
            messagesSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            setMessages([]);

            const chatRef = doc(firestore, "chats", selectedChat.id);
            await updateDoc(chatRef, {
                lastMessage: "",
                lastMessageTimestamp: null,
            });

            toast({
                title: "Chat Cleared",
                description: "All messages in this chat have been deleted.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

        } catch (error) {
            console.error("Error clearing chat:", error);
            toast({
                title: "Error",
                description: "Failed to clear chat messages.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const deleteChat = async () => {
        if (!selectedChat || !user) return;

        try {
            const chatRef = doc(firestore, "chats", selectedChat.id);
            const messagesRef = collection(firestore, "chats", selectedChat.id, "messages");
            const messagesSnapshot = await getDocs(messagesRef);

            const batch = writeBatch(firestore);
            messagesSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            await deleteDoc(chatRef);

            toast({
                title: "Chat deleted",
                description: "The chat has been successfully deleted.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setSelectedChat(null);
        } catch (error) {
            console.error("Error deleting chat:", error);
            toast({
                title: "Error",
                description: "Failed to delete chat.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
    <Flex 
        flexDir="column" 
        h="100%" 
        w="100%" 
        bgGradient="linear(to-br, #0A0F1F, #162447, #1F4068, #1B1B2F)" 
    >
        {/* Chat Header */}
        <HStack 
            p={1} 
            bg="rgba(255, 255, 255, 0.05)" 
            justify="space-between"
        >
            <HStack>
                <IconButton 
                    icon={<ArrowBackIcon />} 
                    onClick={() => setSelectedChat(null)} 
                    aria-label="Back" 
                    color="white" 
                    bg="transparent" 
                    _hover={{ bg: "rgba(255, 255, 255, 0.1)" }} 
                />
                <Link to={`/${participantName}`}>
                    <Flex alignItems="center" gap={2}>
                        <Avatar src={participantProfile} name={participantName} boxSize={8} />
                        <Text fontWeight="bold" color="white">{participantName}</Text>
                    </Flex>
                </Link>
            </HStack>

            {/* 3-dot Menu */}
            <Menu>
                <MenuButton 
                    as={IconButton} 
                    icon={<BsThreeDotsVertical />} 
                    aria-label="Options" 
                    variant="ghost" 
                    color="white"
                />
                <MenuList bg="gray.800" border="none">
                    <MenuItem _hover={{ bg: "gray.700" }} onClick={clearChat}>Clear Chat</MenuItem>
                    <MenuItem _hover={{ bg: "gray.700" }} color="red.400" onClick={deleteChat}>Delete Chat</MenuItem>
                </MenuList>
            </Menu>
        </HStack>

        {/* Messages List */}
        <VStack 
            flex="1" 
            overflowY="auto" 
            p={2} 
            spacing={1} 
            align="stretch"
        >
            {Object.keys(groupedMessages).map((date) => (
                <VStack key={date} align="stretch">
                    <Text align="center" color="gray.400" fontSize="sm" fontWeight="bold" my={1}>{date}</Text>
                    {groupedMessages[date].map((msg) => (
                        <VStack
                            key={msg.id}
                            alignSelf={msg.sender === user.uid ? "flex-end" : "flex-start"}
                            p={1} 
                            borderRadius="lg"
                            bg={msg.sender === user.uid ? "blue.600" : "gray.700"}
                            color="white"
                            maxW="75%"
                            minW="15%"
                            spacing={1}
                            alignItems="start"
                            boxShadow="0px 2px 6px rgba(0, 0, 0, 0.3)"
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

        {/* Message Input */}
        <HStack 
            p={2} 
            bg="rgba(255, 255, 255, 0.05)"  
        >
            <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                bg="rgba(255, 255, 255, 0.1)"
                color="white"
                _placeholder={{ color: "gray.400" }}
                _focus={{ bg: "rgba(255, 255, 255, 0.2)" }}
            />
            <IconButton
                icon={<FiSend />}
                onClick={sendMessage}
                bg="blue.500"
                _hover={{ bg: "blue.600" }}
                color="white"
                boxShadow="0 0 8px rgba(0, 122, 255, 0.6)"
                aria-label="Send"
            />
        </HStack>
    </Flex>
);

};

export default ChatBox;