import { useEffect, useState } from "react";
import { 
  Box, Container, Text, Avatar, VStack, HStack, Spacer 
} from "@chakra-ui/react";
import { 
  collection, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc 
} from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";

const formatTime = (timestamp) => {
  if (!timestamp) return "Unknown";
  const date = timestamp.toDate();
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
};

// Categorize notifications based on time
const categorizeNotifications = (notifications) => {
  const today = new Date();
  const categories = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    "This Month": [],
    Older: [],
  };

  notifications.forEach((notif) => {
    const notifDate = notif.timestamp?.toDate();
    const diffDays = Math.floor((today - notifDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) categories.Today.push(notif);
    else if (diffDays === 1) categories.Yesterday.push(notif);
    else if (diffDays <= 7) categories["This Week"].push(notif);
    else if (diffDays <= 30) categories["This Month"].push(notif);
    else categories.Older.push(notif);
  });

  return categories;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!authUser) return;

    const q = query(
      collection(firestore, "notifications"),
      where("receiverId", "==", authUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [authUser]);

  const markAsSeen = async (notifId) => {
    const notifRef = doc(firestore, "notifications", notifId);
    await updateDoc(notifRef, { seen: true });
  };

  const clearAllNotifications = async () => {
    const batchDelete = notifications.map((notif) =>
      deleteDoc(doc(firestore, "notifications", notif.id))
    );
    await Promise.all(batchDelete);
  };

  const categorizedNotifications = categorizeNotifications(notifications);

  return (
    <Container maxW="container.sm" py={5}>
      <Box align="center" mb={5}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Notifications
        </Text>
      </Box>

      {notifications.length > 0 && (
        <Text
          align="right"
          fontSize="sm"
          color="blue.400"
          cursor="pointer"
          onClick={clearAllNotifications}
        >
          Clear All
        </Text>
      )}

      {notifications.length === 0 ? (
        <Text color="gray.500" textAlign="center">No new notifications yet.</Text>
      ) : (
        <VStack spacing={3} align="stretch">
          {Object.entries(categorizedNotifications).map(([category, notifs]) =>
            notifs.length > 0 && (
              <Box key={category}>
                <Text fontSize="md" fontWeight="bold" color="gray.400" mb={2}>
                  {category}
                </Text>
                <VStack spacing={2} align="stretch">
                  {notifs.map((notif) => (
                    <Box
                      key={notif.id}
                      p={3}
                      borderRadius="lg"
                      bg={notif.seen ? "gray.700" : "gray.800"}
                      cursor="pointer"
                      _hover={{ bg: "gray.600" }}
                      onClick={() => markAsSeen(notif.id)}
                    >
                      <HStack spacing={3}>
                        <Avatar size="sm" src={notif.senderProfilePic || ""} />
                        <Box flex="1">
                          <Text fontSize="sm" fontWeight="bold">
                            {notif.senderName}{" "}
                            <Text as="span" fontWeight="normal">
                              {notif.type === "like" ? "liked your post." : "started following you."}
                            </Text>
                          </Text>
                        </Box>
                        <Spacer />
                        <Text fontSize="xs" color="gray.400">
                          {formatTime(notif.timestamp)}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )
          )}
        </VStack>
      )}
    </Container>
  );
};

export default NotificationsPage;
