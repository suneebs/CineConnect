import { useEffect, useState } from "react";
import {
  Box, Container, Text, Avatar, VStack, HStack, Spacer,
  Flex, Skeleton, SkeletonCircle
} from "@chakra-ui/react";
import {
  collection, query, where, orderBy, onSnapshot, deleteDoc, doc
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

const categorizeNotifications = (notifications) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  const categories = {
    Today: [], Yesterday: [], "This Week": [], "This Month": [], Older: [],
  };

  notifications.forEach((notif) => {
    if (!notif.timestamp) return;
    const notifDate = notif.timestamp.toDate();
    notifDate.setHours(0, 0, 0, 0);
    if (notifDate.getTime() === today.getTime()) categories.Today.push(notif);
    else if (notifDate.getTime() === yesterday.getTime()) categories.Yesterday.push(notif);
    else if (notifDate >= oneWeekAgo) categories["This Week"].push(notif);
    else if (notifDate >= oneMonthAgo) categories["This Month"].push(notif);
    else categories.Older.push(notif);
  });

  return categories;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [authUser]);

  const clearAllNotifications = async () => {
    const batchDelete = notifications.map((notif) =>
      deleteDoc(doc(firestore, "notifications", notif.id))
    );
    await Promise.all(batchDelete);
  };

  const categorizedNotifications = categorizeNotifications(notifications);

  return (
    <Container maxW="container.sm">
      <Flex align="center" justify="space-between" borderBottom="1px solid rgba(255, 255, 255, 0.2)" mb={1}>
        <Text fontSize="2xl" fontWeight="bold">Notifications</Text>
        {notifications.length > 0 && !isLoading && (
          <Text
            fontSize="sm"
            color="blue.400"
            cursor="pointer"
            onClick={clearAllNotifications}
          >
            Clear All
          </Text>
        )}
      </Flex>

      {isLoading ? (
        <VStack spacing={3} align="stretch" pt={6}>
          {[...Array(5)].map((_, i) => (
            <Box key={i} p={2} borderRadius="lg" bg="rgba(255, 255, 255, 0.05)">
              <HStack spacing={2}>
                <SkeletonCircle size="8" />
                <Box flex="1">
                  <Skeleton height="10px" mb={3} />
                  <Skeleton height="10px" width="80%" />
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      ) : notifications.length === 0 ? (
        <Text color="gray.400" textAlign="center">No new notifications yet.</Text>
      ) : (
        <VStack spacing={1} align="stretch">
          {Object.entries(categorizedNotifications).map(([category, notifs]) =>
            notifs.length > 0 && (
              <Box key={category}>
                <Text fontSize="md" fontWeight="bold" color="gray.300" mb={2}>
                  {category}
                </Text>
                <VStack spacing={1} align="stretch">
                  {notifs.map((notif) => (
                    <Box
                      key={notif.id}
                      p={2}
                      borderRadius="lg"
                      bg="rgba(255, 255, 255, 0.05)"
                      _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                      transition="0.2s ease-in-out"
                    >
                      <HStack spacing={2}>
                        <Avatar size="sm" src={notif.senderProfilePic || ""} />
                        <Box flex="full">
                          <Text fontSize="sm" fontWeight="bold">
                            {notif.senderName}{" "}
                            <Text as="span" fontWeight="normal">
                              {notif.type === "comment"
                                ? `commented on a post: "${notif.commentText}"`
                                : notif.type === "like"
                                ? "liked your post."
                                : "started following you."}
                            </Text>
                          </Text>
                        </Box>
                        <Spacer />
                        {category === "Today" && (
                          <Text fontSize="xs" color="gray.400">
                            {formatTime(notif.timestamp)}
                          </Text>
                        )}
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
