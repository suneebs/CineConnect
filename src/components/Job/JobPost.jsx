import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // ✅ Use onSnapshot for real-time updates
import { 
  Box, Text, Flex, Avatar, Button, VStack, HStack, Divider, Badge, Spacer 
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import useApplyJob from "../../hooks/useApplyJob";

const JobPost = ({ job }) => {
  const [user, setUser] = useState(null);
  const [applied, setApplied] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { applyForJob } = useApplyJob();

  // Fetch user details who posted the job
  useEffect(() => {
    if (!job.userId) return;
    
    const userRef = doc(firestore, "users", job.userId);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUser(snapshot.data());
      }
    });

    return () => unsubscribe();
  }, [job.userId]);

  // ✅ Real-time listener for job applicants
  useEffect(() => {
    if (!currentUser) return;

    const jobRef = doc(firestore, "jobs", job.id);
    const unsubscribe = onSnapshot(jobRef, (snapshot) => {
      if (snapshot.exists()) {
        const updatedJob = snapshot.data();
        setApplied(updatedJob.applicants?.includes(currentUser.uid));
      }
    });

    return () => unsubscribe();
  }, [job.id, currentUser]);

  // Apply for Job
  const handleApply = async () => {
    if (!currentUser) return;
    await applyForJob(job.id, currentUser.uid);
  };

  return (
    <Box 
      p={5} 
      borderRadius="lg" 
      boxShadow="lg"
      bg="rgba(25, 25, 25, 0.95)"
      bgGradient="linear(to-b, rgba(30,30,30,0.92), rgba(15,15,15,0.88))"
      border="1px solid rgba(255,255,255,0.1)"
      transition="0.2s ease-in-out"
      _hover={{ 
        boxShadow: "xl", 
        transform: "scale(1.02)", 
        bgGradient: "linear(to-b, rgba(35,35,35,0.95), rgba(20,20,20,0.9))"
      }}
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" mb={3}>
        <Avatar size="md" name={user?.username} src={user?.profilePicURL || ""} />
        <VStack align="start" spacing={0} ml={3}>
          <Text fontSize="sm" fontWeight="bold" color="white">{user?.username || "Unknown User"}</Text>
          <Text fontSize="xs" color="gray.400">
            {job.createdAt ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true }) : "Just now"}
          </Text>
        </VStack>
        <Spacer />
        <Badge colorScheme="purple">{job.category}</Badge>
      </Flex>

      <Divider borderColor="gray.600" />

      <VStack align="start" spacing={3} mt={3} fontSize="sm" color="gray.300">
        <Text fontSize="lg" fontWeight="bold" color="white">{job.title}</Text>
        <HStack><Text fontWeight="medium" color="gray.400">📍 Location:</Text> <Text>{job.location}</Text></HStack>
        <HStack><Text fontWeight="medium" color="gray.400">👤 Gender:</Text> <Text>{job.gender}</Text></HStack>
        <HStack><Text fontWeight="medium" color="gray.400">📅 Age Range:</Text> <Text>{job.age}</Text></HStack>
        <HStack><Text fontWeight="medium" color="gray.400">💼 Experience:</Text> <Text>{job.experience || "Not mentioned"}</Text></HStack>
        <HStack><Text fontWeight="medium" color="gray.400">📌 Description:</Text> <Text noOfLines={2}>{job.description}</Text></HStack>
      </VStack>

      <Flex mt={4} justify="center">
        <Button 
          colorScheme={applied ? "gray" : "blue"} 
          size="sm" 
          borderRadius="full" 
          onClick={handleApply} 
          isDisabled={applied}
        >
          {applied ? "Applied" : "Apply Now"}
        </Button>
      </Flex>
    </Box>
  );
};

export default JobPost;
