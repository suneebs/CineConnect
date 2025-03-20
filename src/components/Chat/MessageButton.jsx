import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import useAuthStore from "../../store/authStore";

const MessageButton = ({ user }) => {
    const authUser = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    if (authUser.uid === user.uid) return null; // Hide button on own profile

    const handleMessageClick = async () => {
        if (!authUser || !user) return;

        // ✅ Check if chat already exists
        const chatQuery = query(
            collection(firestore, "chats"),
            where("participants", "array-contains", authUser.uid)
        );

        const chatSnapshot = await getDocs(chatQuery);
        let existingChat = null;

        chatSnapshot.forEach((doc) => {
            const chatData = doc.data();
            if (chatData.participants.includes(user.uid)) {
                existingChat = { id: doc.id, ...chatData };
            }
        });

        let chatId;

        if (existingChat) {
            chatId = existingChat.id;
        } else {
            // ✅ Create a new chat if it doesn’t exist
            const newChatRef = await addDoc(collection(firestore, "chats"), {
                participants: [authUser.uid, user.uid],
                lastMessage: "",
                lastMessageTimestamp: serverTimestamp(),
                unreadCounts: { [authUser.uid]: 0, [user.uid]: 0 },
            });

            chatId = newChatRef.id;
        }

        // ✅ Navigate to the chat page with the chatId
        navigate(`/chat/${chatId}`);
    };

    return (
        <Button onClick={handleMessageClick} colorScheme="blue">
            Message
        </Button>
    );
};

export default MessageButton;
