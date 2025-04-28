import { firestore } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Avatar, AvatarGroup, Box, Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; 
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import { FaMapMarkerAlt } from "react-icons/fa";


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
    <Flex gap={{ base: 2, sm: 10 }} py={{ base: 1, sm: 10 }} >
      <VStack>
        <AvatarGroup size={{ base: "lg", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
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

      <VStack alignItems={"start"} gap={1} mx={"auto"} flex={1}>
        <Flex
          gap={4}
          justifyContent={"flex-start"}
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

        <Text fontSize={"xs"} fontWeight={"bold"}>
          {userProfile.fullName}
        </Text>

        <Text fontSize={"sm"}>{userProfile.bio}</Text>

        <Flex fontSize={"sm"} alignItems={"center"} gap={1}>
          {userProfile.location?
          <FaMapMarkerAlt /> : ""
          }
          {/* {userProfile.location || "Not specified"} */}
          {userProfile.location}
        </Flex>

        <Flex gap={2} wrap="wrap" fontSize={"xs"}>
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
