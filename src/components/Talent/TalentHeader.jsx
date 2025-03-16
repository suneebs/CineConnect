import { Input, Flex, Box } from "@chakra-ui/react";

const TalentHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <Box mb={6} mt={3} borderBottom="1px solid" borderColor="whiteAlpha.300">
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>Cinema Talent Directory</h1>
      <p>Discover talented professionals in the cinema industry</p>

      <Flex w="full" mb={4} mt={10}>
        <Input
          placeholder="Search talents by name, type, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Flex>
    </Box>
  );
};

export default TalentHeader;
