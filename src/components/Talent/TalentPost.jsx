import { Box, Image, Text, VStack, HStack, Button, Flex, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const TalentPost = ({ talent, setTalents }) => {
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(talent.uid);
  const authUser = useAuthStore((state) => state.user);

  const onFollowUser = async () => {
    await handleFollowUser();

    // ✅ Update state dynamically
    setTalents((prevTalents) =>
      prevTalents.map((t) =>
        t.uid === talent.uid
          ? {
              ...t,
              followers: isFollowing
                ? talent.followers.filter((follower) => follower.uid !== authUser.uid)
                : [...talent.followers, authUser],
            }
          : t
      )
    );
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" w="full" transition="0.2s ease-in-out" _hover={{transform: "scale(1.02)",}}>
      {/* Full-size Image */}
      <Link to={`/${talent.username}`}>
      <Image src={talent.profilePicURL} alt={talent.username} objectFit="cover" w="100%" h="200px" />
      </Link>
      
      {/* Talent Info */}
      <VStack spacing={3} p={4} align="start" w="100%">
        {/* Username & Follow Button */}
        <Flex justify="space-between" align="center" w="100%">
          <Link to={`/${talent.username}`}>
          <Text fontWeight="bold">{talent.username}</Text>
          </Link>
          {authUser?.uid !== talent.uid && ( // ✅ Hide button if it's the same user
            <Button
              size="sm"
              colorScheme="blue"
              borderRadius="md"
              onClick={onFollowUser}
              isLoading={isUpdating} // ✅ Disable button while updating
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Flex>

        {/* Location with Professional Grey Icon */}
        <HStack>
          <Icon as={FaMapMarkerAlt} color="gray.500" />
          <Text fontSize="sm" color="gray.200">
            {talent.location?.length > 0 ? talent.location : "Location not specified"}
          </Text>
        </HStack>

        {/* Professions List */}
        {Array.isArray(talent?.profession) && talent.profession.some((prof) => prof.trim() !== "") && (
          <HStack flexWrap="wrap">
            {talent.profession.map((prof, index) => (
              <Box key={index} bg="gray.700" color="white" borderRadius="md" fontSize="xs" px={2} py={1}>
                {prof}
              </Box>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default TalentPost;
