import { Box, Text, VStack, HStack, IconButton, Spinner } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import useFetchAppliedJobs from "../../hooks/useFetchAppliedJobs";
import useApplyJob from "../../hooks/useApplyJob";
import { auth } from "../../firebase/firebase";

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
        <Spinner size="lg" color="blue.400" />
      ) : appliedJobs.length === 0 ? (
        <Text fontSize="lg" color="gray.500" textAlign="center">
          You haven’t applied to any jobs yet.
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {appliedJobs.map((job) => (
            <Box
              key={job.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="gray.800"
              transition="0.2s ease-in-out"
              _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            >
              <Text fontSize="lg" fontWeight="bold" color="white">
                {job.title}
              </Text>
              <Text fontSize="sm" color="gray.400">{job.description}</Text>

              {/* ✅ Revert Application Button */}
              <HStack justify="flex-end" mt={3}>
                <IconButton icon={<FaTrash />} aria-label="Revert Application" size="sm" colorScheme="red" onClick={() => handleRevertApplication(job.id)} />
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default AppliedJobs;
