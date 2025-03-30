import { useEffect, useState } from "react";
import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, 
  VStack, Box, Text, Avatar, Spinner, HStack, Divider 
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { Link } from "react-router-dom";

const JobApplicantsModal = ({ isOpen, onClose, jobId }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId || !isOpen) return;

    const fetchApplicants = async () => {
      setLoading(true);
      setApplicants([]);

      try {
        const jobDocRef = doc(firestore, "jobs", jobId);
        const jobSnapshot = await getDoc(jobDocRef);

        if (!jobSnapshot.exists()) {
          console.warn("Job not found!");
          setLoading(false);
          return;
        }

        const jobData = jobSnapshot.data();
        const applicantIds = jobData.applicants || [];

        if (applicantIds.length === 0) {
          setApplicants([]);
          setLoading(false);
          return;
        }

        const applicantDetails = await Promise.all(
          applicantIds.map(async (userId) => {
            try {
              const userDocRef = doc(firestore, "users", userId);
              const userSnapshot = await getDoc(userDocRef);
              
              if (!userSnapshot.exists()) return null;

              return { id: userId, ...userSnapshot.data() };
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
              return null;
            }
          })
        );

        setApplicants(applicantDetails.filter(Boolean));
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }

      setLoading(false);
    };

    fetchApplicants();
  }, [jobId, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white" borderRadius="12px" boxShadow="2xl">
        <ModalHeader fontSize="lg" fontWeight="bold" borderBottom="1px solid rgba(255,255,255,0.1)" align={"center"}>
          Applicants
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loading ? (
            <VStack justify="center" align="center" minH="150px">
              <Spinner size="lg" color="blue.400" />
            </VStack>
          ) : applicants.length === 0 ? (
            <Text fontSize="md" color="gray.500" textAlign="center" py={4}>
              No applicants yet.
            </Text>
          ) : (
            <VStack spacing={1} align="stretch">
              {applicants.map((applicant, index) => (
                <Box
                  key={applicant.id}
                  p={1}
                >
                  <HStack spacing={4}>
                    <Avatar size="md" name={applicant.name} src={applicant.profilePicURL || ""} />
                    <VStack align="start" spacing={0}>
                      <Link to={`/${applicant.username}`}>
                      <Text fontSize="md" fontWeight="bold">{applicant.username || "Unknown"}</Text>
                      </Link>
                      <Text fontSize="sm" color="gray.400">📍 {applicant.location || "Location not provided"}</Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JobApplicantsModal;
