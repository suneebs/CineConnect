import { 
  Box, Image, Text, VStack, HStack, Button, Flex, Icon, Badge 
} from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

const TalentPost = ({ talent, setTalents }) => {
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(talent.uid);
  const authUser = useAuthStore((state) => state.user);

  const onFollowUser = async () => {
    await handleFollowUser();
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
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg="rgba(255, 255, 255, 0.05)"  // Glassmorphism Effect
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: "scale(1.03)",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.4)",
      }}
    >
      {/* Profile Image */}
      <Link to={`/${talent.username}`}>
        <Image 
          src={talent.profilePicURL} 
          alt={talent.username} 
          objectFit="cover" 
          w="100%" 
          h={{base:"100px",sm:"240px"}}
          borderTopRadius="lg"
          transition="0.3s"
          _hover={{ filter: "brightness(1.2)" }}
        />
      </Link>

      {/* Talent Info Section */}
      <VStack spacing={1} p={2} align="start" w="100%">
        {/* Header: Name & Follow Button */}
        <Flex justify="space-between" align="center" w="100%">
          <Link to={`/${talent.username}`}>
            <Text  fontSize={{base:"sm",sm:"lg"}} color="white">
              {talent.username}
            </Text>
          </Link>
          {authUser?.uid !== talent.uid && (
            <Button
              size={{base:"xs",sm:"sm"}}
              colorScheme={isFollowing ? "gray" : "blue"}
              fontSize={{base:"xs",sm:"sm"}}
              isLoading={isUpdating}
              _hover={{
                transform: "scale(1.05)",
                bg: isFollowing ? "gray.600" : "blue.500",
              }}
              onClick={onFollowUser}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Flex>

        {/* Location Section */}
        <HStack>
          <Icon as={FaMapMarkerAlt} color="cyan.300" />
          <Text fontSize={{base:"xs",sm:"sm"}} color="gray.300">
            {talent.location?.length > 0 ? talent.location : "Location not specified"}
          </Text>
        </HStack>

        {/* Profession Badges with Neon Effect */}
        {Array.isArray(talent?.profession) && talent.profession.some((prof) => prof.trim() !== "") && (
          <HStack flexWrap="wrap" spacing={2}>
            {talent.profession.map((prof, index) => (
              <Badge
                key={index}
                bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                // px={3}
                // py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)"
                
              >
                {prof}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default TalentPost;
