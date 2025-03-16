import { Avatar, AvatarGroup, Box, Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for navigation
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";

const ProfileHeader = () => {
  const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

  return (
    <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
      {/* ✅ Avatar Section */}
      <VStack>
        <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
          <Avatar src={userProfile.profilePicURL} alt="Profile Pic" />
        </AvatarGroup>

        {/* ✅ Message Button BELOW Avatar */}
        {visitingAnotherProfileAndAuth && (
          <Button
            bg={"green.500"}
            color={"white"}
            _hover={{ bg: "green.600" }}
            size={{ base: "xs", md: "sm" }}
            onClick={() => navigate(`/messages?user=${userProfile.username}`)}
          >
            Message
          </Button>
        )}
      </VStack>

      {/* ✅ User Info Section */}
      <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
        <Flex
          gap={4}
          direction={{ base: "column", sm: "row" }}
          justifyContent={{ base: "center", sm: "flex-start" }}
          alignItems={"center"}
          w={"full"}
        >
          <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>

          {/* If visiting own profile, show "Edit Profile" button */}
          {visitingOwnProfileAndAuth && (
            <Button
              bg={"blue.500"}
              color={"black"}
              _hover={{ bg: "blue.600" }}
              size={{ base: "xs", md: "sm" }}
              onClick={onOpen}
            >
              Edit Profile
            </Button>
          )}

          {/* If visiting another profile, show "Follow" button */}
          {visitingAnotherProfileAndAuth && (
            <Button
              bg={"blue.500"}
              color={"white"}
              _hover={{ bg: "blue.600" }}
              size={{ base: "xs", md: "sm" }}
              onClick={handleFollowUser}
              isLoading={isUpdating}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Flex>

        <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <Text as="span" fontWeight={"bold"} mr={1}>
              {userProfile.posts?.length || 0}
            </Text>
            Posts
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <Text as="span" fontWeight={"bold"} mr={1}>
              {userProfile.followers?.length || 0}
            </Text>
            Followers
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            <Text as="span" fontWeight={"bold"} mr={1}>
              {userProfile.following?.length || 0}
            </Text>
            Following
          </Text>
        </Flex>

        <Text fontSize={"sm"} fontWeight={"bold"}>
          {userProfile.fullName}
        </Text>

        <Text fontSize={"sm"}>{userProfile.bio}</Text>

        <Text fontSize={"sm"}>
          <Text as="span" fontWeight={"bold"}>📍</Text>
          {userProfile.location || "Not specified"}
        </Text>

        <Flex gap={2} wrap="wrap">
          {Array.isArray(userProfile?.profession) && userProfile.profession.filter((prof) => prof.trim() !== "").length > 0 ? (
            userProfile.profession
              .filter((prof) => prof.trim() !== "") // Remove empty strings
              .map((prof, index) => (
                <Box key={index} bg="gray.700" color="white" borderRadius="md" px={2} py={1}>
                  {prof}
                </Box>
              ))
          ) : (
            ""
          )}
        </Flex>
      </VStack>

      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
    </Flex>
  );
};

export default ProfileHeader;
