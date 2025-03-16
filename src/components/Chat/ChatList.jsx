import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Text,
    VStack,
    HStack,
    Badge,
    Spacer,
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
        <VStack spacing={3} w="full" align="stretch">
            {/* ✅ Search Bar */}
            <Box p={3}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={SearchIcon} color="gray.500" />
                    </InputLeftElement>
                    <Input
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="gray.800"
                        borderRadius="md"
                        _focus={{ bg: "gray.700" }}
                    />
                </InputGroup>
            </Box>

            {/* ✅ Chat List */}
            {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                    <HStack
                        key={chat.id}
                        p={1}
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
                <Text textAlign="center" color="gray.500" p={3}>
                    No chats found.
                </Text>
            )}
        </VStack>
    );
};

export default ChatList;
