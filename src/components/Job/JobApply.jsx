import { useState } from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Textarea } from "@chakra-ui/react";

const JobApply = ({ isOpen, onClose, onApply }) => {
  const [message, setMessage] = useState("");

  const handleApply = () => {
    onApply(message);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalHeader>Apply for Job</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea placeholder="Write a short message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleApply}>Apply</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JobApply;
