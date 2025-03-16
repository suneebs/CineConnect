import { Box, Flex, Text } from "@chakra-ui/react";
import ChatList from "../../components/Chat/ChatList";
import ChatBox from "../../components/Chat/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <Flex 
      h="100vh"
      bg="gray.900"         /* Unified background for the whole page */
      color="white"         /* White text color for consistency */
    >
      {/* 🔹 Left: Chat List */}
      <Box
        w={{ base: "100%", xl: "30%" }}
        h="full"
        borderRight="1px solid gray"
        display={{ base: selectedChat ? "none" : "block", md: "block" }}
        bg="gray.800"        /* Slightly lighter for the chat list */
      >
        <ChatList
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
      </Box>

      {/* 🔹 Right: Chat Box */}
      <Box
        w={{ base: "100%", xl: "70%" }}
        h="full"
        display={{ base: selectedChat ? "block" : "none", md: "block" }}
      >
        {selectedChat ? (
          <ChatBox
            chat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ) : (
          <Box p={5} textAlign="center" h="full" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="lg" color="gray.400">
              Select a chat to start messaging
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default ChatPage;
