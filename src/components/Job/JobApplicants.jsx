import { VStack, Box, Avatar, Text, HStack } from "@chakra-ui/react";

const JobApplicants = ({ applicants }) => {
  return (
    <VStack spacing={3} align="stretch">
      {applicants.length > 0 ? (
        applicants.map((applicant, index) => (
          <Box key={index} p={3} bg="gray.800" borderRadius="lg">
            <HStack>
              <Avatar size="sm" src={applicant.profilePic} />
              <Text fontSize="sm">{applicant.name}</Text>
            </HStack>
          </Box>
        ))
      ) : (
        <Text textAlign="center" color="gray.400">No applicants yet.</Text>
      )}
    </VStack>
  );
};

export default JobApplicants;
    