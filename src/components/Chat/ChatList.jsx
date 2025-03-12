import { VStack, Box, Avatar, Text, Badge } from "@chakra-ui/react";

const ChatList = ({ setSelectedChat, selectedChat }) => {
  // Dummy chat users
  const dummyChatUsers = [
    {
      id: "1",
      username: "John Doe",
      profilePicURL: "https://randomuser.me/api/portraits/men/1.jpg",
      lastMessage: "Hey! How are you?",
      lastMessageTime: "2h ago",
      unreadCount: 2,
    },
    {
      id: "2",
      username: "Jane Smith",
      profilePicURL: "https://randomuser.me/api/portraits/women/2.jpg",
      lastMessage: "Let's catch up tomorrow!",
      lastMessageTime: "1d ago",
      unreadCount: 0,
    },
    {
      id: "3",
      username: "Michael Scott",
      profilePicURL: "https://randomuser.me/api/portraits/men/3.jpg",
      lastMessage: "That's what she said! 😂",
      lastMessageTime: "3d ago",
      unreadCount: 5,
    },
  ];

  return (
    <VStack spacing={4} p={4} align="start" w="full">
      {dummyChatUsers.map((chat) => (
        <Box
          key={chat.id}
          display="flex"
          alignItems="center"
          gap={3}
          w="full"
          p={3}
          borderRadius="md"
          bg={selectedChat?.id === chat.id ? "gray.700" : "gray.800"}
          cursor="pointer"
          _hover={{ bg: "gray.700" }}
          onClick={() => setSelectedChat(chat)}
          position="relative"
        >
          <Avatar src={chat.profilePicURL} size="md" />
          <Box flex="1">
            <Text fontWeight="bold">{chat.username}</Text>
            <Text fontSize="sm" color="gray.400" isTruncated>
              {chat.lastMessage}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text fontSize="xs" color="gray.400">
              {chat.lastMessageTime}
            </Text>
            {chat.unreadCount > 0 && (
              <Badge colorScheme="blue" borderRadius="full" px={2}>
                {chat.unreadCount}
              </Badge>
            )}
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default ChatList;
