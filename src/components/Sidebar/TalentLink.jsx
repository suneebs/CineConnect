import { Icon, Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

const TalentLink = () => {
  return (
    <Tooltip
      hasArrow
      label="Talent Directory"
      ml={1}
      openDelay={500}
      placement='right'
      display={{ base: "block", md: "none" }}
    >
      <Link
        display="flex"
        as={RouterLink}
        to="/talents"
        alignItems="center"
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Icon as={FaUsers} boxSize={5} />
        <Box display={{ base: "none", md: "block" }}>Talent Directory</Box>
      </Link>
    </Tooltip>
  );
};

export default TalentLink;
