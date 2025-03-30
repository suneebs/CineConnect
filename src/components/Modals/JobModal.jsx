import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Stack,
  List,
  ListItem,
  Box,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

const rolesList = [
  "Actor", "Director", "Producer", "Editor", "Cinematographer",
  "Screenwriter", "Sound Designer", "Makeup Artist", "Costume Designer",
  "Production Assistant", "Casting Director", "Set Designer", "Animator",
  "Music Composer", "VFX Artist", "Colorist", "Assistant Director","Musician"
];

const JobModal = ({ onCreate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const inputValue = e.target.value;
    setJob((prev) => ({ ...prev, category: inputValue }));

    // Filter roles dynamically
    if (inputValue.length > 0) {
      const filtered = rolesList.filter((role) =>
        role.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles([]);
    }
  };

  const handleSelectCategory = (role) => {
    setJob((prev) => ({ ...prev, category: role }));
    setFilteredRoles([]); // Hide suggestions after selection
  };

  const handleSubmit = () => {
    if (!job.title || !job.category || !job.location || !job.description) {
      alert("Please fill all required fields.");
      return;
    }
    onCreate(job);
    onClose();
  };

  return (
    <>
      <Button
        leftIcon={<AiOutlinePlus />}
        colorScheme="blue"
        onClick={onOpen}
        borderRadius="md"
        fontSize="sm"
        fontWeight="medium"
        px={4}
        py={2}
        bg="blue.600"
        _hover={{ bg: "blue.700" }}
      >
        New Job
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="md" p={4}>
          <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center">
            Create Job Posting
          </ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel fontWeight="medium">Job Title</FormLabel>
                <Input
                  name="title"
                  value={job.title}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  variant="filled"
                />
              </FormControl>

              {/* Dynamic Category/Role Input with Suggestions */}
              <FormControl position="relative">
                <FormLabel fontWeight="medium">Role</FormLabel>
                <Input
                  name="category"
                  value={job.category}
                  onChange={handleCategoryChange}
                  placeholder="e.g. Actor, Director, Editor"
                  variant="filled"
                />
                {filteredRoles.length > 0 && (
                  <Box
                    position="absolute"
                    bg="gray.800"
                    borderRadius="md"
                    boxShadow="md"
                    mt={1}
                    w="full"
                    maxH="150px"
                    overflowY="auto"
                    zIndex={10}
                  >
                    <List>
                      {filteredRoles.map((role, index) => (
                        <ListItem
                          key={index}
                          p={2}
                          _hover={{ cursor: "pointer" }}
                          onClick={() => handleSelectCategory(role)}
                        >
                          {role}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </FormControl>

              <Stack direction="row" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontWeight="medium">Gender</FormLabel>
                  <Input
                    name="gender"
                    value={job.gender}
                    onChange={handleChange}
                    placeholder="e.g. Male, Female, Any"
                    variant="filled"
                  />
                </FormControl>

                <FormControl flex={1}>
                  <FormLabel fontWeight="medium">Age Range</FormLabel>
                  <Input
                    name="age"
                    value={job.age}
                    onChange={handleChange}
                    placeholder="e.g. 18-30"
                    variant="filled"
                  />
                </FormControl>
              </Stack>

              <FormControl>
                <FormLabel fontWeight="medium">Location</FormLabel>
                <Input
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  variant="filled"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium">Experience (Optional)</FormLabel>
                <Input
                  name="experience"
                  value={job.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2+ years in film industry"
                  variant="filled"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium">Job Description</FormLabel>
                <Textarea
                  name="description"
                  value={job.description}
                  onChange={handleChange}
                  placeholder="Provide details about the job"
                  variant="filled"
                  rows={4}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} colorScheme="gray" mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Post Job
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JobModal;
