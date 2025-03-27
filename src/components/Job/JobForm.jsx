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
  Flex,
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
    >
      <VStack spacing={4} align="stretch">
      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
        <FormControl>
          <Input name="title" placeholder="Job Title" value={job.title} onChange={handleChange} size="sm" />
        </FormControl>

        <FormControl position="relative">
          <Input name="category" placeholder="Role" value={job.category} onChange={handleCategoryChange} size="sm" />
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
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <Input name="gender" placeholder="Gender" value={job.gender} onChange={handleChange} size="sm" />
          </FormControl>
          <FormControl>
            <Input name="age" value={job.age} placeholder="Age" onChange={handleChange} size="sm" />
          </FormControl>
        </Grid>

        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          <FormControl>
            <Input name="location" placeholder="Location" value={job.location} onChange={handleChange} size="sm" />
          </FormControl>
          <FormControl>
            <Input name="experience" placeholder="Experience" value={job.experience} onChange={handleChange} size="sm" />
          </FormControl>
        </Grid>

        <FormControl>
          <Textarea name="description" placeholder="Description" value={job.description} onChange={handleChange} size="sm" rows={2} />
        </FormControl>
        <Button width={"auto"} colorScheme="blue" size="sm" alignSelf={'flex-end'} onClick={handleSubmit}>
          {editingJob ? "Update" : "Post"}
        </Button>
      </VStack>
    </Box>
  );
};

export default JobForm;
