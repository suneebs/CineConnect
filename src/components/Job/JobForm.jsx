import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Grid,
  Textarea,
  List,
  ListItem,
  VStack,
  Flex,
  Heading,
} from "@chakra-ui/react";

const jobRoles = ["Actor", "Director", "Editor", "Producer", "Cinematographer", "Screenwriter"];

const JobForm = ({ onSubmit, editingJob }) => {
  const [job, setJob] = useState({
    title: "",
    category: "",
    gender: "",
    age: "",
    location: "",
    experience: "",
    description: "",
  });

  const [filteredRoles, setFilteredRoles] = useState([]);

  useEffect(() => {
    if (editingJob) setJob(editingJob);
  }, [editingJob]);

  const handleChange = (e) => setJob({ ...job, [e.target.name]: e.target.value });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setJob({ ...job, category: value });

    setFilteredRoles(
      value.length > 0
        ? jobRoles.filter((role) => role.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  const handleSelectCategory = (role) => {
    setJob({ ...job, category: role });
    setFilteredRoles([]);
  };

  const handleSubmit = () => {
    if (!job.title || !job.category || !job.location || !job.description) {
      alert("Please fill all required fields.");
      return;
    }
    onSubmit(job);
  };

  return (
    <Box
      p={1}
      borderRadius="lg"
      bg="rgba(255, 255, 255, 0.1)" // ✅ Glassmorphic effect
      boxShadow="lg"
      transition="0.3s ease-in-out"
      mx="auto"
      mb={1}
    >
      <Heading size="md" mb={1} color="white" textAlign="center">
        {editingJob ? "Edit Job Post" : "Create Job Post"}
      </Heading>

      <VStack spacing={1} align="stretch">
        {/* ✅ Title & Category Fields */}
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <Input
              name="title"
              placeholder="Job Title *"
              value={job.title}
              onChange={handleChange}
              size="sm"
              bg="gray.800"
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl position="relative">
            <Input
              name="category"
              placeholder="Role *"
              value={job.category}
              onChange={handleCategoryChange}
              size="sm"
              bg="gray.800"
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
            {filteredRoles.length > 0 && (
              <Box
                position="absolute"
                bg="gray.700"
                borderRadius="md"
                boxShadow="md"
                mt={1}
                w="full"
                maxH="100px"
                overflowY="auto"
                zIndex={10}
              >
                <List>
                  {filteredRoles.map((role, index) => (
                    <ListItem
                      key={index}
                      p={2}
                      fontSize="sm"
                      _hover={{ cursor: "pointer", bg: "gray.600", color: "white" }}
                      onClick={() => handleSelectCategory(role)}
                    >
                      {role}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </FormControl>
        </Grid>

        {/* ✅ Gender & Age Fields */}
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <Input
              name="gender"
              placeholder="Gender"
              value={job.gender}
              onChange={handleChange}
              size="sm"
              bg="gray.800"
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
          <FormControl>
            <Input
              name="age"
              placeholder="Age"
              value={job.age}
              onChange={handleChange}
              size="sm"
              bg="gray.800"
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
        </Grid>

        {/* ✅ Location & Experience Fields */}
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <Input
              name="location"
              placeholder="Location *"
              value={job.location}
              onChange={handleChange}
              size="sm"
              bg="gray.800"
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
          <FormControl>
            <Input
              name="experience"
              placeholder="Experience"
              value={job.experience}
              onChange={handleChange}
              size="sm"
              bg="gray.800"
              color="white"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
        </Grid>

        {/* ✅ Description Field */}
        <FormControl>
          <Textarea
            name="description"
            placeholder="Job Description *"
            value={job.description}
            onChange={handleChange}
            size="sm"
            rows={1}
            bg="gray.800"
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
        </FormControl>

        {/* ✅ Submit Button */}
        <Flex justify="flex-end">
          <Button colorScheme="blue" size="sm" onClick={handleSubmit}>
            {editingJob ? "Update" : "Post"}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default JobForm;
