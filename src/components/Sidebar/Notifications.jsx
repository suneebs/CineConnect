import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { useSidebarStore } from "../../Context/sidebarContext"; // ✅ Import Sidebar State

const Notifications = () => {
    const navigate = useNavigate();
    const setShowNotifications = useSidebarStore((state) => state.setShowNotifications);

    const handleClick = () => {
        setShowNotifications(true); // ✅ Show Notifications
        navigate("/"); // ✅ Force navigate to HomePage
    };

    return (
        <Tooltip hasArrow placement="right" ml={1} openDelay={500} display={ { base:"block", md:"none"}}>
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
                <IoMdNotificationsOutline size={25} />
                <Box display={{ base: "none", md: "block" }}>Notifications</Box>
            </Flex>
        </Tooltip>
    );
};

export default Notifications;
