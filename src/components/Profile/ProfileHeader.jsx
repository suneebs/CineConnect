import { firestore } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Avatar, AvatarGroup, Box, Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; 
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";

const ProfileHeader = () => {
  const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
  const navigate = useNavigate();

  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

  const handleMessage = async () => {
    if (!authUser || !userProfile) return;

    const userId1 = authUser.uid;
    const userId2 = userProfile.uid;

    if (!userId1 || !userId2) return;

    // Check if chat already exists
    const chatQuery = query(
      collection(firestore, "chats"),
      where("participants", "array-contains", userId1)
    );

    const chatSnapshot = await getDocs(chatQuery);
    let chatId = null;

    chatSnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.participants.includes(userId2)) {
        chatId = doc.id;
      }
    });

    // If no chat exists, create a new one
    if (!chatId) {
      const chatRef = await addDoc(collection(firestore, "chats"), {
        participants: [userId1, userId2],
        lastMessage: "",
        lastUpdated: new Date(),
      });
      chatId = chatRef.id;
    }

    // Navigate to chat and ensure ChatBox opens
    navigate(`/chat/${chatId}`);
  };

  return (
    <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
      <VStack>
        <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
          <Avatar src={userProfile.profilePicURL} alt="Profile Pic" />
        </AvatarGroup>

        {visitingAnotherProfileAndAuth && (
          <Button
            bg={"green.500"}
            color={"white"}
            _hover={{ bg: "green.600" }}
            size={{ base: "xs", md: "sm" }}
            onClick={handleMessage}
          >
            Message
          </Button>
        )}
      </VStack>

      <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
        <Flex
          gap={4}
          direction={{ base: "column", sm: "row" }}
          justifyContent={{ base: "center", sm: "flex-start" }}
          alignItems={"center"}
          w={"full"}
        >
          <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>

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
              .filter((prof) => prof.trim() !== "") 
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
