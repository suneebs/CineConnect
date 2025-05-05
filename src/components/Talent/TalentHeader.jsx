import { Input, Flex, Box } from "@chakra-ui/react";

const TalentHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <Box mt={{base:-6,sm:3}} >
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>Cinema Talent Directory</h1>
      <p>Discover talented professionals in the cinema industry</p>

      <Flex w="full" mb={4} mt={{base:2, sm:10}}>
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          borderColor="gray.200"
				  _placeholder={{ color: "gray.400" }}
        />
      </Flex>
    </Box>
  );
};

export default TalentHeader;
