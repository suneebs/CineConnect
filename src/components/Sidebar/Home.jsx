import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { useSidebarStore } from "../../Context/sidebarContext"; // ✅ Import Sidebar State

const Home = () => {
    const navigate = useNavigate();
    const setShowNotifications = useSidebarStore((state) => state.setShowNotifications);

    const handleClick = () => {
        setShowNotifications(false); // ✅ Reset to FeedPosts
        navigate("/"); // ✅ Force navigate to HomePage
    };

    return (
        <Tooltip hasArrow  placement="right" ml={1} openDelay={500} display={{ base:"block", md:"none"}}>
            <Flex
                alignItems={"center"}
                gap={4}
                _hover={{ bg: "whiteAlpha.400" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                onClick={handleClick} // ✅ Call handleClick on click
                cursor="pointer"
            >
                <AiFillHome size={25} />
                <Box display={{ base: "none", md: "block" }}>Home</Box>
            </Flex>
        </Tooltip>
    );
};

export default Home;
