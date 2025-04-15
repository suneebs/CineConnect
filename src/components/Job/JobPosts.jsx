import { SimpleGrid, Text, Spinner } from "@chakra-ui/react";
import JobPost from "./JobPost";

const JobPosts = ({ jobs, loading, searchTerm }) => {
  if (loading) return <Spinner size="lg" color="blue.400" mx="auto" display="block" />;
  
  if (!jobs.length) 
    return (
      <Text textAlign="center" color="gray.400">
        {searchTerm ? `No jobs found for "${searchTerm}"` : "No job postings found."}
      </Text>
    );

  return (
    <SimpleGrid 
      columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
      spacing={4} 
      w="full"
    >
      {jobs
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .map((job) => <JobPost key={job.id} job={job} />)}
    </SimpleGrid>
  );
};

export default JobPosts;