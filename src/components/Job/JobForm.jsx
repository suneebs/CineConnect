import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Textarea,
  List,
  ListItem,
  VStack,
  Divider,
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
      p={6} // ✅ Same padding as MyJobPosts
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.900"
      boxShadow="lg"
      w="full" // ✅ Ensures width consistency
      maxW="600px" // ✅ Exact same width as MyJobPosts
      mx="auto"
      transition="0.2s ease-in-out"
      _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel fontSize="sm">Job Title</FormLabel>
          <Input name="title" value={job.title} onChange={handleChange} size="sm" />
        </FormControl>

        <FormControl position="relative">
          <FormLabel fontSize="sm">Role</FormLabel>
          <Input name="category" value={job.category} onChange={handleCategoryChange} size="sm" />
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
                    p={1}
                    fontSize="sm"
                    _hover={{ cursor: "pointer", bg: "gray.600" }}
                    onClick={() => handleSelectCategory(role)}
                  >
                    {role}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </FormControl>

        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <FormLabel fontSize="sm">Gender</FormLabel>
            <Input name="gender" value={job.gender} onChange={handleChange} size="sm" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Age</FormLabel>
            <Input name="age" value={job.age} onChange={handleChange} size="sm" />
          </FormControl>
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <FormLabel fontSize="sm">Location</FormLabel>
            <Input name="location" value={job.location} onChange={handleChange} size="sm" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Experience</FormLabel>
            <Input name="experience" value={job.experience} onChange={handleChange} size="sm" />
          </FormControl>
        </Grid>

        <FormControl>
          <FormLabel fontSize="sm">Description</FormLabel>
          <Textarea name="description" value={job.description} onChange={handleChange} size="sm" rows={2} />
        </FormControl>

        <Divider borderColor="gray.600" />

        <Button w="full" colorScheme="blue" size="md" onClick={handleSubmit}>
          {editingJob ? "Update Job" : "Post Job"}
        </Button>
      </VStack>
    </Box>
  );
};

export default JobForm;
