import { useState, useMemo } from "react";
import {
  Box,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Divider
} from "@chakra-ui/react";
import JobPosts from "../../components/Job/JobPosts";
import MyJobOffers from "../../components/Job/MyJobOffers";
import useFetchJobs from "../../hooks/useFetchJobs";

const JobPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { jobs, loading } = useFetchJobs();

  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;
    
    const term = searchTerm.toLowerCase();
    return jobs.filter((job) => 
      (job.title && job.title.toLowerCase().includes(term)) ||
      (job.category && job.category.toLowerCase().includes(term)) ||
      (job.location && job.location.toLowerCase().includes(term)) ||
      (job.role && job.role.toLowerCase().includes(term)) ||
      (job.description && job.description.toLowerCase().includes(term))
    );
  }, [jobs, searchTerm]);

  return (
    <Box px={{base:1,sm:6}} py={{sm:4}} w="full" mt={{sm:4}}>
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size={{base:"md",sm:"lg"}}
        borderRadius="md"
        bg="rgba(255, 255, 255, 0.05)"
        _focus={{ bg: "rgba(255, 255, 255, 0.1)" }}
        mb={{base:2,sm:4}}
      />

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Flex>
            <Tab _selected={{ bg: "blue.500", color: "white" }}>Ongoing Jobs</Tab>
            <Tab _selected={{ bg: "blue.500", color: "white" }}>My Job Offers</Tab>
          </Flex>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* <Divider my={{base:2,sm:4}} /> */}
            <JobPosts jobs={filteredJobs} loading={loading} searchTerm={searchTerm} />
          </TabPanel>
          <TabPanel>
            <MyJobOffers searchTerm={searchTerm} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default JobPage;