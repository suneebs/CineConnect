import { Flex } from "@chakra-ui/react";
import Home from "../Sidebar/Home";
import CreatePost from "../Sidebar/CreatePost";
import TalentLink from "../Sidebar/TalentLink";
import JobLink from "../Sidebar/JobLink";
import MessagesLink from "../Sidebar/MessagesLink";

const MobileFooter = () => {
  return (
    <Flex
      w="full"
      align="center"
      justify="space-around"
      position="fixed"
      bottom="0"
      zIndex="10"
      bg="rgba(0, 0, 0, 0)"  // No semi-transparent background color
      backdropFilter="blur(10px)"  // Only the background gets blurred
      borderTop="1px solid"
      borderColor="whiteAlpha.300"
    >
      <Home />
      <TalentLink />
      <CreatePost />
      <JobLink />
      <MessagesLink />
    </Flex>
  );
};

export default MobileFooter;
