import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Text, VStack, HStack, Badge, Spacer } from "@chakra-ui/react";

const ChatList = ({ chats, setSelectedChat, selectedChat }) => {
    const navigate = useNavigate();

    // ✅ Sort chats by latest message timestamp (most recent first)
    const sortedChats = [...chats].sort((a, b) => {
        const timeA = a.lastMessageTimestamp || 0; // Default to 0 if no timestamp
        const timeB = b.lastMessageTimestamp || 0;
        return timeB - timeA; // Newest first
    });

    return (
        <VStack spacing={3} w="full" align="stretch">
            {sortedChats.length > 0 ? (
                sortedChats.map((chat) => (
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
                        {/* ✅ Show unread badge if unreadCount > 0 */}
                        {chat.unreadCount > 0 && (
                            <Badge colorScheme="blue" color="white" borderRadius="full" px={2} fontSize="xs">
                                {chat.unreadCount}
                            </Badge>
                        )}
                    </HStack>
                ))
            ) : (
                <Text textAlign="center" color="gray.500">
                    No chats yet.
                </Text>
            )}
        </VStack>
    );
};

export default ChatList;
