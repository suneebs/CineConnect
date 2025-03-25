import { Box, Text, Badge, Flex, Spacer } from "@chakra-ui/react";

const JobPost = ({ job }) => {
  return (
    <Box 
      p={4} 
      bg="gray.900" 
      borderRadius="md" 
      boxShadow="md" 
      _hover={{ boxShadow: "xl", bg: "gray.800" }}
      transition="0.2s ease-in-out"
    >
      <Flex>
        <Box>
          <Text fontSize="lg" fontWeight="bold">{job.title}</Text>
          <Text fontSize="sm" color="gray.400">{job.location} • {job.category}</Text>
        </Box>
        <Spacer />
        <Badge colorScheme="blue">{job.type}</Badge>
      </Flex>
      <Text mt={2} fontSize="sm" color="gray.300">{job.description}</Text>
    </Box>
  );
};

export default JobPost;
