import { SimpleGrid, Text, Spinner } from "@chakra-ui/react";
import JobPost from "./JobPost";
import useFetchJobs from "../../hooks/useFetchJobs"; // ✅ Fetch jobs directly

const JobPosts = () => {
  const { jobs, loading } = useFetchJobs(); // ✅ Fetch jobs here

  if (loading) return <Spinner size="lg" color="blue.400" mx="auto" display="block" />;
  
  if (!jobs.length) 
    return <Text textAlign="center" color="gray.400">No job postings found.</Text>;

  return (
    <SimpleGrid 
      columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} // ✅ Dynamic columns
      spacing={1} 
      w="full"
    >
      {jobs.map((job) => <JobPost key={job.id} job={job} />)}
    </SimpleGrid>
  );
};

export default JobPosts;
