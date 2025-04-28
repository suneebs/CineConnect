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
  Collapse,
  Icon,
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

const MyJobPosts = ({ searchTerm = "" }) => {
  const { myJobs, loading } = useFetchMyJobs();
  const [editingJob, setEditingJob] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useAuth();
  const { isOpen: isFormOpen, onToggle: toggleForm } = useDisclosure();

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
      toggleForm();
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
        <VStack spacing={1} align="stretch">
          {
          [...myJobs]
  .filter((job) =>
    searchTerm
      ? (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.category && job.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.role && job.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
  )
  .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
  .map((job) => (
              <Box
                key={job.id}
                p={4}
                borderRadius="lg"
                bg="rgba(255, 255, 255, 0.1)" // ✅ Glassmorphic effect
                boxShadow="lg"
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

                <Text fontSize="md" color="gray.300" mt={1}>
                  {job.description}
                </Text>

                <Divider my={2} borderColor="gray.600" />

                {/* ✅ Job Details */}
                <HStack spacing={2} wrap="wrap" mb={3}>
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
                    {job.gender || "Not mentioned"}
                  </Badge>
                  <Badge bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)">
                    {job.age || "Not mentioned"}
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

                {/* ✅ Action Buttons */}
                <HStack spacing={3} justify="space-between">
                  <HStack spacing={3}>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      leftIcon={<Icon as={FaEdit} />}
                      onClick={() => {
                        setEditingJob(job);
                        if (!isFormOpen) toggleForm();
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      leftIcon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </HStack>

                  <Button
                    colorScheme="green"
                    variant="solid"
                    size="sm"
                    leftIcon={<Icon as={FaUsers} />}
                    onClick={() => {
                      setSelectedJob(job);
                      onOpen();
                    }}
                  >
                    View Applicants
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
