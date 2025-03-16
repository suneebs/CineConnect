import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Text, VStack, HStack } from "@chakra-ui/react";

const ChatList = ({ chats, setSelectedChat, selectedChat }) => {
    const navigate = useNavigate();

    return (
        <VStack spacing={3} w="full" align="stretch">
            {chats.length > 0 ? (
                chats.map((chat) => (
                    <HStack
                        key={chat.id}
                        p={3}
                        borderRadius="md"
                        bg={selectedChat?.id === chat.id ? "grey.700" : "transparent"}
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
