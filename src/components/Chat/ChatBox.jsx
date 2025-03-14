import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Box, VStack, HStack, Input, Button, Text, Avatar, Flex } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";

const ChatBox = ({ selectedChat, participantName, participantProfile }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!selectedChat || !user) return;

        const messagesRef = collection(firestore, "chats", selectedChat.id, "messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, [selectedChat, user]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        await addDoc(collection(firestore, "chats", selectedChat.id, "messages"), {
            sender: user.uid,
            message: newMessage,
            timestamp: serverTimestamp(),
        });

        setNewMessage("");
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Flex flexDir="column" h="100%" w="100%">
            {/* 🔹 Chat Header (Profile Picture & Name) */}
            <HStack p={3} boxShadow="md" bg="gray.800">
                <Avatar src={participantProfile} name={participantName} />
                <Text fontWeight="bold">{participantName}</Text>
            </HStack>

            {/* Messages */}
            <VStack flex="1" overflowY="auto" p={3} spacing={4} align="stretch">
                {messages.map((msg, index) => (
                    <HStack
                        key={index}
                        alignSelf={msg.sender === user.uid ? "flex-end" : "flex-start"}
                        p={3}
                        borderRadius="md"
                        maxW="75%"
                    >
                        {msg.sender !== user.uid && <Avatar size="sm" />}
                        <Text>{msg.message}</Text>
                    </HStack>
                ))}
                <div ref={messagesEndRef} />
            </VStack>

            {/* Input Box */}
            <HStack p={3} boxShadow="md">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <Button onClick={sendMessage} colorScheme="blue">
                    Send
                </Button>
            </HStack>
        </Flex>
    );
};

export default ChatBox;
