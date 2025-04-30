import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { FaMapMarkerAlt } from "react-icons/fa";
import { firestore } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import useApplyJob from "../../hooks/useApplyJob";

const JobPost = ({ job }) => {
  const [user, setUser] = useState(null);
  const [applied, setApplied] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const { applyForJob } = useApplyJob();

  // Fetch job poster details
  useEffect(() => {
    if (!job.userId) return;

    const userRef = doc(firestore, "users", job.userId);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) setUser(snapshot.data());
    });

    return () => unsubscribe();
  }, [job.userId]);

  // Track applied status in real-time
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
      borderRadius="lg"
      bg="rgba(255, 255, 255, 0.05)" // Glassmorphism
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.5)"
      transition="all 0.3s ease-in-out"
      
      p={{base:2,md:4}}
    >
      {/* Job Poster Info */}
      <Flex align="center" mb={3}>
        <Avatar size="md" name={user?.username} src={user?.profilePicURL || ""} />
        <VStack align="start" spacing={0} ml={3}>
          <Text fontSize="sm" fontWeight="bold" color="white">
            {user?.username || "Unknown User"}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {job.createdAt ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true }) : "Just now"}
          </Text>
        </VStack>
        <Spacer />
        <Badge 
                bg="rgba(255, 255, 255, 0.1)"
                color="white"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0px 0px 8px rgba(255, 255, 255, 0.1)"
                >
                  {job.category}
                </Badge>
      </Flex>

      <Divider borderColor="gray.600" />

      {/* Job Details */}
      <VStack align="start" spacing={3} mt={3} fontSize="sm" color="gray.300">
        <Text fontSize="lg" fontWeight="bold" color="white">
          {job.title}
        </Text>
        <HStack>
          <Icon as={FaMapMarkerAlt} color="cyan.300" />
          <Text>{job.location || "Location not specified"}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="medium" color="gray.400">
            Gender:
          </Text>
          <Text>{job.gender || "Not mentioned"}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="medium" color="gray.400">
            Age:
          </Text>
          <Text>{job.age || "Not mentioned"}</Text>
        </HStack>
        <HStack>
          <Text fontWeight="medium" color="gray.400">
            Experience:
          </Text>
          <Text>{job.experience || "Not mentioned"}</Text>
        </HStack>
        <Text fontWeight="medium" color="gray.400">
          Description:
        </Text>
        <Text>{job.description}</Text>
      </VStack>

      {/* Apply Button */}
      <Flex mt={4} justify="center">
        <Button
          colorScheme={applied ? "gray" : "blue"}
          size="sm"
          borderRadius="full"
          onClick={handleApply}
          isDisabled={applied}
          transition="0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          {applied ? "Applied" : "Apply Now"}
        </Button>
      </Flex>
    </Box>
  );
};

export default JobPost;
