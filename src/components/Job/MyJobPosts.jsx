import { useState } from "react";
import { Box, Text, VStack, HStack, IconButton, Spinner } from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import JobModal from "../Modals/JobModal";
import useFetchMyJobs from "../../hooks/useFetchMyJobs";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const MyJobPosts = () => {
  const { myJobs, loading } = useFetchMyJobs();
  const [editingJob, setEditingJob] = useState(null);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    try {
      await deleteDoc(doc(firestore, "jobs", jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <Box>
      {/* ✅ Job Modal */}
      <Box mb={5} textAlign="right">
        <JobModal onEdit={() => {}} editingJob={editingJob} setEditingJob={setEditingJob} />
      </Box>

      {loading ? (
        <Spinner size="lg" color="blue.400" />
      ) : myJobs.length === 0 ? (
        <Text fontSize="lg" color="gray.500" textAlign="center">
          You haven’t posted any jobs yet.
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {myJobs.map((job) => (
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

              {/* ✅ Actions */}
              <HStack justify="space-between" mt={3}>
                <HStack>
                  <IconButton icon={<FaEdit />} aria-label="Edit Job" size="sm" onClick={() => setEditingJob(job)} />
                  <IconButton icon={<FaTrash />} aria-label="Delete Job" size="sm" colorScheme="red" onClick={() => handleDeleteJob(job.id)} />
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default MyJobPosts;
