import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { Box, VStack, HStack, Input, Button, Text, Avatar, Flex, IconButton } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { ArrowBackIcon } from "@chakra-ui/icons";
import useAuth from "../../hooks/useAuth";

const ChatBox = ({ selectedChat, participantName, participantProfile, setSelectedChat }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!selectedChat || !user) return;

        const messagesRef = collection(firestore, "chats", selectedChat.id, "messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });

        return () => unsubscribe();
    }, [selectedChat, user]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageData = {
            sender: user.uid,
            message: newMessage,
            timestamp: serverTimestamp(),
        };

        await addDoc(collection(firestore, "chats", selectedChat.id, "messages"), messageData);
        await updateDoc(doc(firestore, "chats", selectedChat.id), {
            lastMessage: newMessage,
            lastMessageTimestamp: serverTimestamp(),
        });

        setNewMessage("");
    };

    return (
        <Flex flexDir="column" h="100%" w="100%" bg="gray.900" borderRadius="md" boxShadow="lg">
            <HStack p={4} bg="gray.800" borderRadius="md" boxShadow="sm">
                <IconButton icon={<ArrowBackIcon />} onClick={() => setSelectedChat(null)} colorScheme="gray" aria-label="Back" />
                <Avatar src={participantProfile} name={participantName} />
                <Text fontWeight="bold" color="white">{participantName}</Text>
            </HStack>

            <VStack flex="1" overflowY="auto" p={4} spacing={4} align="stretch">
                {messages.map((msg) => (
                    <VStack
                        key={msg.id}
                        alignSelf={msg.sender === user.uid ? "flex-end" : "flex-start"}
                        p={3}
                        borderRadius="lg"
                        bg={msg.sender === user.uid ? "blue.500" : "gray.700"}
                        color="white"
                        maxW="75%"
                        spacing={1}
                    >
                        <Text>{msg.message}</Text>
                        {msg.timestamp && (
                            <Text fontSize="xs" color="gray.300" alignSelf="flex-end">
                                {msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </Text>
                        )}
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
                <IconButton icon={<FiSend />} onClick={sendMessage} colorScheme="blue" aria-label="Send" />
            </HStack>
        </Flex>
    );
};

export default ChatBox;
