import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Text, VStack, HStack, Badge, Spacer } from "@chakra-ui/react";

const ChatList = ({ chats, setSelectedChat, selectedChat }) => {
    const navigate = useNavigate();

    return (
        <VStack spacing={3} w="full" align="stretch">
            {chats.length > 0 ? (
                chats.map((chat) => {
                    return (
                        <HStack
                            key={chat.id}
                            p={3}
                            borderRadius="md"
                            bg={selectedChat?.id === chat.id ? "gray.700" : "transparent"}
                            _hover={{ bg: "gray.900", cursor: "pointer" }}
                            onClick={() => {
                                setSelectedChat(chat);
                                navigate(`/chat/${chat.id}`);
                            }}
                        >
                            <Avatar src={chat.participantProfile} name={chat.participantName} />
                            <Box flex="1">
                                <Text fontWeight="bold">{chat.participantName}</Text>
                                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                    {chat.lastMessage ? chat.lastMessage : "No messages yet"}
                                </Text>
                            </Box>
                            <Spacer />
                            {/* ✅ Show badge if unreadCount > 0 */}
                            {chat.unreadCount > 0 && (
    <Badge colorScheme="blue" borderRadius="full" px={2} fontSize="xs">
        {chat.unreadCount}
    </Badge>
)}
                        </HStack>
                    );
                })
            ) : (
                <Text textAlign="center" color="gray.500">
                    No chats yet.
                </Text>
            )}
        </VStack>
    );
};

export default ChatList;
