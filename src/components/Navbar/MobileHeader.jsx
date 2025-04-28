import { Flex } from "@chakra-ui/react";
import ProfileLink from "../Sidebar/ProfileLink";
import Notifications from "../Sidebar/Notifications";
import Search from "../Sidebar/Search";
import { CineConnectLogo } from "../../assets/constants";

const MobileHeader = () => {
	return (
		<Flex
			w="full"
			px={4}
			py={3}
			align="center"
			justify="space-between"
		>
			{/* Left Side: Profile + Logo */}
			<Flex align="center" gap={0}>
				<ProfileLink />
				
			</Flex>

			{/* Right Side: Search + Notifications */}
			<Flex align="center" gap={4}>
				<Search />
				<Notifications />
			</Flex>
		</Flex>
	);
};

export default MobileHeader;
