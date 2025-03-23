import { Box, Container, Text } from "@chakra-ui/react";

const NotificationsPage = () => {
	return (
		<Container maxW={"container.sm"} >
			<Box textAlign="center">
				<Text fontSize="xl" fontWeight="bold">Notifications</Text>
				<Text color="gray.500">No new notifications yet.</Text>
			</Box>
		</Container>
	);
};

export default NotificationsPage;
