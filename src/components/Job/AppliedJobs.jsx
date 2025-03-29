import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Button,
  Badge,
  Divider,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { GrRevert } from "react-icons/gr";
import useFetchAppliedJobs from "../../hooks/useFetchAppliedJobs";
import useApplyJob from "../../hooks/useApplyJob";
import { auth } from "../../firebase/firebase";
import { format } from "date-fns";

const AppliedJobs = () => {
  const { appliedJobs, loading } = useFetchAppliedJobs();
  const { removeApplication } = useApplyJob();

  const handleRevertApplication = async (jobId) => {
    const user = auth.currentUser;
    if (!user) return console.error("No user logged in!");

    try {
      await removeApplication(jobId, user.uid);
    } catch (error) {
      console.error("Error reverting job application:", error);
    }
  };

  return (
    <Box>
      {loading ? (
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="lg" color="blue.400" />
        </Flex>
      ) : appliedJobs.length === 0 ? (
        <Text fontSize="lg" color="gray.500" textAlign="center">
          You haven’t applied to any jobs yet.
        </Text>
      ) : (
        <VStack spacing={1} align="stretch">
          {appliedJobs.map((job) => (
            <Box
              key={job.id}
              p={4}
              borderRadius="lg"
              bg="rgba(255, 255, 255, 0.1)" // ✅ Glassmorphic effect
              backdropFilter="blur(10px)" // ✅ Blurred background
              boxShadow="lg"
            >
            
              {/* ✅ Job Title */}
              <Text fontSize="xl" fontWeight="bold" color="white">
                {job.title}
              </Text>

              {/* ✅ Job Description */}
              <Text fontSize="md" color="gray.300" mt={1}>
                {job.description}
              </Text>

              <Divider my={2} borderColor="gray.600" />

              {/* ✅ Job Details */}
              <HStack spacing={1} wrap="wrap" mb={2}>
                <Badge bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)">
                  {job.category}
                </Badge>
                <Badge bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)">
                  {job.gender || "Any Gender"}
                </Badge>
                <Badge bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)">
                  {job.age || "Any Age"}
                </Badge>
                <Badge bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)">
                  {job.location}
                </Badge>
                {job.experience && (
                  <Badge bg="rgba(255, 255, 255, 0.1)"
                  color="white"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)">
                    {job.experience}
                  </Badge>
                )}
              </HStack>

              {/* ✅ Revert Application Button */}
              <Flex justify="flex-end">
                <Button
                  leftIcon={<Icon as={GrRevert} />}
                  colorScheme="red"
                  size="sm"
                  variant="solid"
                  onClick={() => handleRevertApplication(job.id)}
                >
                  Revert Application
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default AppliedJobs;
