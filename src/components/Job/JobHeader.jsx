import { useState } from "react";
import { Box, Input, Select, HStack, Button } from "@chakra-ui/react";

const JobHeader = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    location: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box mb={4} p={4} bg="gray.800" borderRadius="lg">
      <HStack spacing={3}>
        <Input
          name="keyword"
          placeholder="Search job titles..."
          value={filters.keyword}
          onChange={handleChange}
        />
        <Select name="category" placeholder="Select category" value={filters.category} onChange={handleChange}>
          <option value="Actor">Actor</option>
          <option value="Director">Director</option>
          <option value="Editor">Editor</option>
          <option value="Cinematographer">Cinematographer</option>
        </Select>
        <Input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
        <Button colorScheme="blue" onClick={() => onSearch(filters)}>Search</Button>
      </HStack>
    </Box>
  );
};

export default JobHeader;
