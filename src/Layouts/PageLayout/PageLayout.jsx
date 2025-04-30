import { Box, Flex, Spinner, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import MobileHeader from "../../components/Navbar/MobileHeader";
import MobileFooter from "../../components/Navbar/MobileFooter";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import Navbar from "../../components/Navbar/Navbar";

const PageLayout = ({ children }) => {
	const { pathname } = useLocation();
	const [user, loading] = useAuthState(auth);
	const isMobile = useBreakpointValue({ base: true, md: false });

	const canRenderSidebar = pathname !== "/auth" && user && !isMobile;
	const canRenderNavbar = !user && !loading && pathname !== "/auth";

	const checkingUserIsAuth = !user && loading;
	if (checkingUserIsAuth) return <PageLayoutSpinner />;

	return (
		<Flex flexDir="column" minH="100vh">
			{/* Unauthenticated Navbar */}
			{canRenderNavbar && <Navbar />}

			{/* Authenticated Mobile Header */}
			{user && isMobile && <MobileHeader />}

			<Flex flex="1" flexDir={canRenderSidebar ? "row" : "column"}>
				{/* Desktop Sidebar */}
				{canRenderSidebar && (
					<Box w={{ base: "70px", md: "240px" }}>
						<Sidebar />
					</Box>
				)}

				{/* Page Content */}
				<Box 
					flex="1" 
					w="full" 
					mx="auto" 
				>
					{children}
				</Box>
			</Flex>

			{/* Authenticated Mobile Footer */}
			{user && isMobile && <MobileFooter />}
		</Flex>
	);
};

export default PageLayout;

const PageLayoutSpinner = () => (
	<Flex flexDir="column" h="100vh" alignItems="center" justifyContent="center">
		<Spinner size="xl" />
	</Flex>
);
