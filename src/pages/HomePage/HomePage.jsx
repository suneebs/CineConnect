import { Box, Container, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Track page changes
import FeedPosts from "../../components/FeedPosts/FeedPosts";
import SuggestedUsers from "../../components/SuggestedUsers/SuggestedUsers";
import NotificationsPage from "../NotificationsPage/NotificationsPage";
import { useSidebarStore } from "../../Context/sidebarContext";

const HomePage = () => {
    const showNotifications = useSidebarStore((state) => state.showNotifications);
    const setShowNotifications = useSidebarStore((state) => state.setShowNotifications);
    const location = useLocation(); // Get the current route

    useEffect(() => {
        // Reset notifications ONLY when coming from another page
        if (location.pathname !== "/") {
            setShowNotifications(false);
        }
    }, [location.pathname, setShowNotifications]);

    return (
        <Container maxW={"container.lg"}>
            <Flex gap={20}>
                <Box flex={2} py={{base:0,sm:8}}>
                    {showNotifications ? <NotificationsPage /> : <FeedPosts />}
                </Box>
                <Box flex={3} mr={20} display={{ base: "none", lg: "block" }} maxW={"300px"}>
                    <SuggestedUsers />
                </Box>
            </Flex>
        </Container>
    );
};

export default HomePage;
