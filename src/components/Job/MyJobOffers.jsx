import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import MyJobPosts from "./MyJobPosts";
import AppliedJobs from "./AppliedJobs";

const MyJobOffers = () => {
  return (
    <Box w="full" maxW="900px" mx="auto">
      <Tabs variant="unstyled">
        <TabList display="flex" justifyContent="space-around" borderBottom="1px solid gray">
          <Tab _selected={{ color: "blue.400", borderBottom: "2px solid blue.400" }} fontSize="lg" fontWeight="bold" py={3}>
            My Job Posts
          </Tab>
          <Tab _selected={{ color: "blue.400", borderBottom: "2px solid blue.400" }} fontSize="lg" fontWeight="bold" py={3}>
            Applied Jobs
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <MyJobPosts />
          </TabPanel>
          <TabPanel px={0}>
            <AppliedJobs />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MyJobOffers;
