import { useState, useEffect } from "react";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import useFetchMyJobs from "../../hooks/useFetchMyJobs";
import JobPost from "./JobPost";
import JobModal from "../Modals/JobModal";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../../firebase/firebase";

const MyJobOffers = () => {
  const { myJobs, loading } = useFetchMyJobs();

  // Function to handle new job creation
  const handleCreateJob = async (jobData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in!");
        return;
      }

      const jobRef = await addDoc(collection(firestore, "jobs"), {
        ...jobData,
        createdAt: serverTimestamp(),
        userId: user.uid, // ✅ Correctly adding the logged-in user's ID
      });

      console.log("Job posted successfully with ID:", jobRef.id);
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <Box w="full">
      {/* New Job Button at the Top */}
      <Box mb={4} textAlign="right">
        <JobModal onCreate={handleCreateJob} />
      </Box>

      {loading ? (
        <Spinner size="lg" color="blue.400" />
      ) : myJobs.length === 0 ? (
        <Text fontSize="lg" color="gray.400" textAlign="center">
          You haven't posted any jobs yet.
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {myJobs.map((job) => (
            <JobPost key={job.id} job={job} isMyJob={true} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default MyJobOffers;
