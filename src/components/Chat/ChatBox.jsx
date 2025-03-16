import { Box, Text, Input, Button, Avatar, Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const ChatBox = ({ chat, setSelectedChat }) => {
  return (
    <Box display="flex" flexDir="column" h="100vh" w="full">
      {/* 🔹 HEADER - Back Button & User Info */}
      <Flex align="center" p={4} borderBottom="1px solid gray" bg="gray.900">
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat(null)} // 🔥 Fix: Properly resets selected chat
          variant="ghost"
          color="white"
          aria-label="Go Back"
        />
        <Avatar src={chat.profilePicURL} size="md" ml={3} />
        <Text fontSize="lg" fontWeight="bold" ml={3}>
          {chat.username}
        </Text>
      </Flex>

      {/* 🔹 MESSAGE AREA */}
      <Box flex="1" p={4} bg="gray.800" overflowY="auto">
        {/* Sample Messages */}
        <Box mt={4} display="flex" flexDir="column" gap={3}>
          {/* Received Message */}
          <Box alignSelf="flex-start" bg="gray.700" p={3} borderRadius="lg" maxW="70%">
            <Text fontSize="sm">Hello! 👋</Text>
            <Text fontSize="xs" color="gray.400" textAlign="right" mt={1}>
              10:15 AM
            </Text>
          </Box>

          {/* Sent Message */}
          <Box alignSelf="flex-end" bg="blue.600" p={3} borderRadius="lg" maxW="70%">
            <Text fontSize="sm" color="white">
              Hi! How are you?
            </Text>
            <Text fontSize="xs" color="gray.300" textAlign="right" mt={1}>
              10:17 AM
            </Text>
          </Box>
        </Box>
      </Box>

      {/* 🔹 FOOTER - Input & Send Button */}
      <Flex p={3} borderTop="1px solid gray" bg="gray.900" align="center">
        <Input placeholder="Type a message..." flex="1" />
        <Button colorScheme="blue" ml={2}>
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default ChatBox;
