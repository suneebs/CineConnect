import { Icon, Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";

const MessagesLink = () => {
  return (
    <Tooltip
      hasArrow
      placement='right'
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display="flex"
        as={RouterLink}
        to="/messages"
        alignItems="center"
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Icon as={BiMessageSquareDetail} boxSize={5} />
        <Box display={{ base: "none", md: "block" }}>Messages</Box>
      </Link>
    </Tooltip>
  );
};

export default MessagesLink;
