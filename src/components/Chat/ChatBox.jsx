// ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";
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
        <Flex flexDir="column" h="100%" w="100%">
            <HStack p={3} boxShadow="md" bg="gray.800">
                <Avatar src={participantProfile} name={participantName} />
                <Text fontWeight="bold">{participantName}</Text>
            </HStack>

            <VStack flex="1" overflowY="auto" p={3} spacing={4} align="stretch">
                {messages.map((msg) => (
                    <HStack key={msg.id} alignSelf={msg.sender === user.uid ? "flex-end" : "flex-start"} p={3} borderRadius="md" maxW="75%">
                        {msg.sender !== user.uid && <Avatar size="sm" />}
                        <Text>{msg.message}</Text>
                    </HStack>
                ))}
                <div ref={messagesEndRef} />
            </VStack>

            <HStack p={3} boxShadow="md">
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
                <Button onClick={sendMessage} colorScheme="blue">Send</Button>
            </HStack>
        </Flex>
    );
};

export default ChatBox;
