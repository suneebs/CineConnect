import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Text,
    VStack,
    HStack,
    Badge,
    Input,
    InputGroup,
    InputLeftElement,
    Icon
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const ChatList = ({ chats, setSelectedChat, selectedChat }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Sort chats by latest message timestamp (most recent first)
    const sortedChats = [...chats].sort((a, b) => {
        const timeA = a.lastMessageTimestamp || 0;
        const timeB = b.lastMessageTimestamp || 0;
        return timeB - timeA;
    });

    // ✅ Filter chats based on search input
    const filteredChats = sortedChats.filter(chat =>
        chat.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <VStack spacing={0} w="full" align="stretch">
            {/* ✅ Search Bar */}
            <Box p={3} mt={5}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={SearchIcon} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="rgba(255, 255, 255, 0.08)"
                        borderRadius="md"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        color="whiteAlpha.900"
                        _placeholder={{ color: "gray.400" }}
                        _focus={{
                            bg: "rgba(255, 255, 255, 0.12)",
                            borderColor: "blue.400",
                        }}
                    />
                </InputGroup>
            </Box>

            {/* ✅ Chat List */}
            {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <HStack
                        key={chat.id}
                        p={1}
                        bg={selectedChat?.id === chat.id ? "rgba(255, 255, 255, 0.1)" : "transparent"}
                        _hover={{ bg: "rgba(255, 255, 255, 0.15)", cursor: "pointer" }}
                        transition="0.2s ease-in-out"
                        onClick={() => {
                            setSelectedChat(chat);
                            navigate(`/chat/${chat.id}`);
                        }}
                    >
                        <Avatar src={chat.participantProfile} name={chat.participantName} />
                        <Box flex="1">
                            <Text color="whiteAlpha.900" fontWeight="medium">
                                {chat.participantName}
                            </Text>
                            <Text fontSize="sm" color="gray.400" noOfLines={1}>
                                {chat.lastMessage ? chat.lastMessage : "No messages yet"}
                            </Text>
                        </Box>

                        {/* ✅ Show unread badge if unreadCount > 0 */}
                        {chat.unreadCount > 0 && (
                            <Badge
                                bg="blue.500"
                                color="white"
                                borderRadius="full"
                                px={2}
                                fontSize="xs"
                                boxShadow="0 0 6px rgba(0, 122, 255, 0.6)"
                            >
                                {chat.unreadCount}
                            </Badge>
                        )}
                    </HStack>
                ))
            ) : (
                <Text textAlign="center" color="gray.500" p={3}>
                    No chats found.
                </Text>
            )}
        </VStack>
    );
};

export default ChatList;
