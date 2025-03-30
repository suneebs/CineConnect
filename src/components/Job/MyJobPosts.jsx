import { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Button,
  useDisclosure,
  Divider,
  Badge,
  Flex,
  Collapse,  // ✅ Import Collapse for smooth transitions
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaUsers } from "react-icons/fa";
import useFetchMyJobs from "../../hooks/useFetchMyJobs";
import JobForm from "./JobForm";
import {
  deleteDoc,
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import JobApplicantsModal from "../Modals/JobApplicantsModal";
import useAuth from "../../hooks/useAuth";
import { format } from "date-fns";

const MyJobPosts = () => {
  const { myJobs, loading } = useFetchMyJobs();
  const [editingJob, setEditingJob] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useAuth();
  const { isOpen: isFormOpen, onToggle: toggleForm } = useDisclosure(); // ✅ Controls form visibility

  // ✅ Create Job
  const handleCreateJob = async (jobData) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const newJob = {
        ...jobData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, "jobs"), newJob);
      console.log("Job created:", docRef.id);
      toggleForm(); // ✅ Close form smoothly
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  // ✅ Edit Job
  const handleEditJob = async (updatedJob) => {
    if (!editingJob) return;

    try {
      await updateDoc(doc(firestore, "jobs", editingJob.id), updatedJob);
      setEditingJob(null);
      toggleForm(); // ✅ Close form smoothly
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  // ✅ Delete Job
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
      {/* ✅ New Job Button */}
      <Flex justify="end" mb={5}>
        <Button colorScheme={isFormOpen ? "red" : "blue"} onClick={toggleForm}>
          {isFormOpen ? "Cancel" : "New Job"}
        </Button>
      </Flex>

      {/* ✅ Smooth Transition for JobForm */}
      <Collapse in={isFormOpen} animateOpacity>
        <JobForm onSubmit={editingJob ? handleEditJob : handleCreateJob} editingJob={editingJob} />
      </Collapse>

      {loading ? (
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="lg" color="blue.400" />
        </Flex>
      ) : myJobs.length === 0 ? (
        <Text fontSize="lg" color="gray.500" textAlign="center">
          You haven’t posted any jobs yet.
        </Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {[...myJobs]
            .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
            .map((job) => (
            <Box
              key={job.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg="gray.900"
              boxShadow="lg"
              transition="0.2s ease-in-out"
              position="relative"
            >
              {/* ✅ Posted Date */}
              {job.createdAt && (
                <Text fontSize="sm" color="gray.400" position="absolute" top={3} right={4}>
                  Posted on {format(new Date(job.createdAt.seconds * 1000), "dd MMM yyyy")}
                </Text>
              )}

              {/* ✅ Job Title */}
              <Text fontSize="xl" fontWeight="bold" color="white">
                {job.title}
              </Text>

              <Text fontSize="md" color="gray.400" mt={1}>
                {job.description}
              </Text>

              <Divider my={4} borderColor="gray.600" />

              {/* ✅ Job Details */}
              <HStack spacing={4} wrap="wrap" mb={4}>
                <Badge colorScheme="blue" px={3} py={1} fontSize="sm" borderRadius="md">
                  {job.category}
                </Badge>
                <Badge colorScheme="purple" px={3} py={1} fontSize="sm" borderRadius="md">
                  {job.gender || "Any Gender"}
                </Badge>
                <Badge colorScheme="green" px={3} py={1} fontSize="sm" borderRadius="md">
                  {job.age || "Any Age"}
                </Badge>
                <Badge colorScheme="orange" px={3} py={1} fontSize="sm" borderRadius="md">
                  {job.location}
                </Badge>
                {job.experience && (
                  <Badge colorScheme="teal" px={3} py={1} fontSize="sm" borderRadius="md">
                    {job.experience}
                  </Badge>
                )}
              </HStack>

              {/* ✅ Action Buttons */}
              <HStack spacing={3} justify="space-between">
                <HStack spacing={3}>
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    size="sm"
                    onClick={() => {
                      setEditingJob(job);
                      if (!isFormOpen) toggleForm();
                    }}
                  >
                    Edit Post
                  </Button>

                  <Button
                    colorScheme="red"
                    variant="solid"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete Post
                  </Button>
                </HStack>

                <Button
                  colorScheme="green"
                  variant="solid"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(job);
                    onOpen();
                  }}
                >
                  Show Applicants
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {/* ✅ Job Applicants Modal */}
      {selectedJob && (
        <JobApplicantsModal
          isOpen={isOpen}
          onClose={onClose}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
    </Box>
  );
};

export default MyJobPosts;
