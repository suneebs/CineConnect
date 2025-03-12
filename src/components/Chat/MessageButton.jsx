import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const MessageButton = ({ user }) => {
  const authUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  if (authUser.uid === user.uid) return null; // Hide button on own profile

  return (
    <Button onClick={() => navigate(`/chat/${user.uid}`)}>
      Message
    </Button>
  );
};

export default MessageButton;
