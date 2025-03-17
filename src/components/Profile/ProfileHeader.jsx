import { useState, useRef } from "react";
import { firestore, auth } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";
import { IoIosSettings } from "react-icons/io";

const ProfileHeader = () => {
  const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuthStore();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef();

  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;

  const handleDeleteAccount = async () => {
    setIsAlertOpen(false); // Close confirmation dialog
    const currentUser = auth.currentUser;
  
    if (!currentUser) return;
  
    try {
      // Fetch all posts created by the user
      const postsQuery = query(collection(firestore, "posts"), where("createdBy", "==", currentUser.uid));
      const postsSnapshot = await getDocs(postsQuery);
  
      // Delete each post
      const deletePromises = postsSnapshot.docs.map((postDoc) => deleteDoc(doc(firestore, "posts", postDoc.id)));
      await Promise.all(deletePromises);
  
      // Delete the user document from Firestore
      await deleteDoc(doc(firestore, "users", currentUser.uid));
  
      // Delete the authentication account
      await deleteUser(currentUser);
  
      // Log the user out and redirect to home
      logout();
      await signOut(auth);
      navigate("/");
      
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Account Deletion Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex gap={{ base: 4, sm: 10 }} direction={{ base: "column", sm: "row" }}>
      {visitingOwnProfileAndAuth && (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<IoIosSettings size={24} />}
            aria-label="Settings"
            position="absolute"
            top={2}
            right={2}
            bg="transparent"
            _hover={{ color: "gray.500" }}
          />
          <MenuList>
            <MenuItem onClick={onOpen}>Edit Profile</MenuItem>
            <MenuItem onClick={() => setIsAlertOpen(true)} color="red.500">
              Delete Account
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      <VStack>
        <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
          <Avatar src={userProfile.profilePicURL} alt="Profile Pic" />
        </AvatarGroup>
      </VStack>

      <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
        <Text fontSize={{ base: "sm", md: "lg" }}>{userProfile.username}</Text>
        <Text fontSize={"sm"} fontWeight={"bold"}>{userProfile.fullName}</Text>
        <Text fontSize={"sm"}>{userProfile.bio}</Text>
        <Text fontSize={"sm"}><Text as="span" fontWeight={"bold"}>📍</Text>{userProfile.location || "Not specified"}</Text>
      </VStack>

      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}

      {/* Confirm Delete Account Dialog */}
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={() => setIsAlertOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent maxW={{base:"300px", md:"sm"}}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Account Deletion
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action <b>cannot</b> be undone!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default ProfileHeader;
