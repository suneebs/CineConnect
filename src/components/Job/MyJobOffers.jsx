import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Spinner,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { deleteDoc, doc, updateDoc, addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import useFetchMyJobs from "../../hooks/useFetchMyJobs";
import useFetchAppliedJobs from "../../hooks/useFetchAppliedJobs";
import JobModal from "../Modals/JobModal";
import { firestore } from "../../firebase/firebase";
import { auth } from "../../firebase/firebase";
import useApplyJob from "../../hooks/useApplyJob";

const MyJobOffers = () => {
  const { myJobs: fetchedMyJobs, loading: loadingMyJobs } = useFetchMyJobs();
  const { appliedJobs: fetchedAppliedJobs, loading: loadingAppliedJobs } = useFetchAppliedJobs();

  const [myJobs, setMyJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const { applyForJob, removeApplication } = useApplyJob();
  

  useEffect(() => {
    setMyJobs(fetchedMyJobs);
  }, [fetchedMyJobs]);

  useEffect(() => {
    setAppliedJobs(fetchedAppliedJobs);
  }, [fetchedAppliedJobs]);

  // ✅ Create Job
  const handleCreateJob = async (jobData) => {
    try {
      const user = auth.currentUser;
      if (!user) return console.error("No user logged in!");

      const jobRef = await addDoc(collection(firestore, "jobs"), {
        ...jobData,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });

      const newJob = { id: jobRef.id, ...jobData, createdAt: new Date() };
      setMyJobs((prevJobs) => [newJob, ...prevJobs]);
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  // ✅ Edit Job
  const handleEditJob = async (jobId, updatedData) => {
    try {
      const jobRef = doc(firestore, "jobs", jobId);
      await updateDoc(jobRef, updatedData);

      setMyJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === jobId ? { ...job, ...updatedData } : job))
      );
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  // ✅ Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    try {
      await deleteDoc(doc(firestore, "jobs", jobId));
      setMyJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleRevertApplication = async (jobId) => {
    const user = auth.currentUser;
    if (!user) return console.error("No user logged in!");
  
    try {
      await removeApplication(jobId, user.uid);
  
      // ✅ Remove from appliedJobs state immediately
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  
      console.log(`Application for job ${jobId} has been reverted.`);
    } catch (error) {
      console.error("Error reverting job application:", error);
    }
  };
  
  
  return (
    <Box w="full" maxW="900px" mx="auto">
      {/* ✅ Job Modal for Creating & Editing */}
      <Box mb={5} textAlign="right">
        <JobModal onCreate={handleCreateJob} onEdit={handleEditJob} editingJob={editingJob} setEditingJob={setEditingJob} />
      </Box>

      {/* ✅ Elegant Tabs */}
      <Tabs variant="unstyled">
        <TabList display="flex" justifyContent="space-around" borderBottom="1px solid gray">
          <Tab
            _selected={{ color: "blue.400", borderBottom: "2px solid blue.400" }}
            fontSize="lg"
            fontWeight="bold"
            py={3}
          >
            My Job Posts
          </Tab>
          <Tab
            _selected={{ color: "blue.400", borderBottom: "2px solid blue.400" }}
            fontSize="lg"
            fontWeight="bold"
            py={3}
          >
            Applied Jobs
          </Tab>
        </TabList>

        <TabPanels>
          {/* ✅ My Job Posts Section */}
          <TabPanel px={0}>
            {loadingMyJobs ? (
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
                        <IconButton
                          icon={<FaEdit />}
                          aria-label="Edit Job"
                          size="sm"
                          onClick={() => setEditingJob(job)}
                        />
                        <IconButton
                          icon={<FaTrash />}
                          aria-label="Delete Job"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteJob(job.id)}
                        />
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </TabPanel>

          {/* ✅ Applied Jobs Section */}
          <TabPanel px={0}>
            {loadingAppliedJobs ? (
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
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Revert Application"
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleRevertApplication(job.id)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MyJobOffers;
