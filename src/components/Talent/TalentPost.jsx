import { Box, Image, Text, VStack, HStack, Button, Flex, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";

const TalentPost = ({ talent }) => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      w="full"
    >
      {/* Full-size Image */}
      <Image 
        src={talent.profilePicURL} 
        alt={talent.username} 
        objectFit="cover" 
        w="100%" 
        h="200px"  
      />

      {/* Talent Info */}
      <VStack spacing={3} p={4} align="start" w="100%">
        {/* Username & Follow Button */}
        <Flex justify="space-between" align="center" w="100%">
          <Text fontWeight="bold">{talent.username}</Text>
          <Button size="sm" colorScheme="blue" borderRadius="md">
            Follow
          </Button>
        </Flex>

        {/* Location with Professional Grey Icon */}
        <HStack>
          <Icon as={FaMapMarkerAlt} color="gray.500" />
          <Text fontSize="sm" color="gray.200">
            {talent.location?.length > 0 ? talent.location : "Location not specified"}
          </Text>
        </HStack>

        {/* Professions List */}
        {Array.isArray(talent?.profession) && talent.profession.some(prof => prof.trim() !== "") && (
          <HStack flexWrap="wrap">
            {talent.profession.map((prof, index) => (
              <Box 
                key={index} 
                bg="gray.700" 
                color="white" 
                borderRadius="md" 
                fontSize="xs" 
                px={2} 
                py={1}
              >
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
