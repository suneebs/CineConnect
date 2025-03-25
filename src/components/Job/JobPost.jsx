import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { 
  Box, Text, Flex, Avatar, Button, VStack, HStack, Divider, Badge, Spacer 
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import useApplyJob from "../../hooks/useApplyJob";

const JobPost = ({ job, onJobUpdate }) => {
  const [user, setUser] = useState(null);
  const [applied, setApplied] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { applyForJob } = useApplyJob();

  // Fetch user details who posted the job
  useEffect(() => {
    const fetchUser = async () => {
      if (!job.userId) return;
      try {
        const userRef = doc(firestore, "users", job.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [job.userId]);

  // Check if the current user has applied for the job
  useEffect(() => {
    if (currentUser && job.applicants?.includes(currentUser.uid)) {
      setApplied(true);
    }
  }, [job.applicants, currentUser]);

  // Apply for Job
  const handleApply = async () => {
    if (!currentUser) return;
    await applyForJob(job.id, currentUser.uid);
    setApplied(true);
    if (onJobUpdate) onJobUpdate();
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
        <Badge colorScheme="purple" px={2} py={1} borderRadius="md">{job.category}</Badge>
      </Flex>

      <Divider borderColor="gray.600" />

      <VStack align="start" spacing={3} flex="1" mt={3} fontSize="sm" color="gray.300">
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
