import { useState } from "react";
import {
  Box,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import JobPosts from "../../components/Job/JobPosts";
import MyJobOffers from "../../components/Job/MyJobOffers";
import useFetchJobs from "../../hooks/useFetchJobs";

const JobPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { jobs, loading } = useFetchJobs();

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box px={6} py={4} w="full" mt={4}>
      {/* Dynamic Search Bar */}
      <Input
        placeholder="Search for Opportunities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="lg"
        borderRadius="md"
        bg="rgba(255, 255, 255, 0.05)"
        _focus={{ bg: "rgba(255, 255, 255, 0.1)" }}
      />

      {/* Tabs for Job Listings */}
      <Tabs variant="soft-rounded" colorScheme="blue" mt={4}>
        <TabList>
          <Flex>
            <Tab _selected={{ bg: "blue.500", color: "white" }}>Ongoing Jobs</Tab>
            <Tab _selected={{ bg: "blue.500", color: "white" }}>My Job Offers</Tab>
          </Flex>
        </TabList>

        <TabPanels>
          <TabPanel>
            <JobPosts jobs={filteredJobs} loading={loading} />
          </TabPanel>
          <TabPanel>
            <MyJobOffers />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default JobPage;
