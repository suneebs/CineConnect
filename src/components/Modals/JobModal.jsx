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
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";

const jobRoles = [
  "Actor", "Director", "Producer", "Screenwriter", "Dialogue Writer",
  "Storyboard Artist", "Casting Director", "Choreographer", "Fight Choreographer",
  "Stunt Performer", "Voice Actor", "Dancer", "Cinematographer", "Camera Operator",
  "Sound Designer", "Film Editor", "VFX Artist", "Colorist", "Production Designer",
  "Makeup Artist", "Costume Designer", "Executive Producer", "Film Critic",
  "Musician"
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

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
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
      >
        New Job
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Job Posting</ModalHeader>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Job Title</FormLabel>
              <Input name="title" value={job.title} onChange={handleChange} placeholder="Job Title" />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Category</FormLabel>
              <Select name="category" value={job.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </FormControl>

            {job.category === "Actor" && (
              <>
                <FormControl mb={3}>
                  <FormLabel>Gender</FormLabel>
                  <Select name="gender" value={job.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Both">Both</option>
                  </Select>
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel>Age Range</FormLabel>
                  <Input name="age" value={job.age} onChange={handleChange} placeholder="e.g. 18-30" />
                </FormControl>
              </>
            )}

            <FormControl mb={3}>
              <FormLabel>Location</FormLabel>
              <Input name="location" value={job.location} onChange={handleChange} placeholder="Location" />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Experience</FormLabel>
              <Input name="experience" value={job.experience} onChange={handleChange} placeholder="Experience (if any)" />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={job.description} onChange={handleChange} placeholder="Job Description" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSubmit}>Post Job</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default JobModal;
