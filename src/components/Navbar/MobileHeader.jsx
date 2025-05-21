import { Flex, Image } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import useUserProfileStore from "../../store/userProfileStore";
import ProfileLink from "../Sidebar/ProfileLink";
import Notifications from "../Sidebar/Notifications";
import Search from "../Sidebar/Search";
import { CineConnectLogo } from "../../assets/constants";

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useUserProfileStore();

  const isOwnProfilePage = userProfile?.username 
    ? location.pathname === `/${userProfile.username}`
    : false;

  return (
    <Flex
      w="full"
      px={3}
      py={3}
      align="center"
      justify="space-between"
    >
      {/* Left Side */}
      <Flex align="center" gap={0}>
        {isOwnProfilePage ? (
            <Flex w={"120px"}>
                <CineConnectLogo />
            </Flex>
        ) : (
          <ProfileLink />
        )}
      </Flex>

      {/* Right Side */}
      <Flex align="center" gap={4}>
        {/* <Search /> */}
        <Notifications />
      </Flex>
    </Flex>
  );
};

export default MobileHeader;
