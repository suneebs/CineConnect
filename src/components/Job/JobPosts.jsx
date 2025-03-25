import { Box, Text, VStack, Spinner } from "@chakra-ui/react";
import JobPost from "./JobPost";
import useFetchJobs from "../../hooks/useFetchJobs"; // ✅ Fetch jobs directly

const JobPosts = () => {
  const { jobs, loading } = useFetchJobs(); // ✅ Fetch jobs here

  if (loading) return <Spinner size="lg" color="blue.400" />;
  
  if (!jobs.length) 
    return <Text textAlign="center" color="gray.400">No job postings found.</Text>;

  return (
    <VStack spacing={4} align="stretch">
      {jobs.map((job) => <JobPost key={job.id} job={job} />)}
    </VStack>
  );
};

export default JobPosts;
