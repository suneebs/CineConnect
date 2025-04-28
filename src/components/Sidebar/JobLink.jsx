import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { MdWork } from "react-icons/md"; // Job icon

const JobLink = () => {
  return (
    <Tooltip
      hasArrow
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link
        display="flex"
        to="/jobs"
        as={RouterLink}
        alignItems="center"
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <MdWork size={20} />
        <Box display={{ base: "none", md: "block" }}>Opportunity</Box>
      </Link>
    </Tooltip>
  );
};

export default JobLink;
