import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import useSearchUser from "../../hooks/useSearchUser";
import { useRef } from "react";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const searchRef = useRef(null);
	const { user, isLoading, getUserProfile, setUser } = useSearchUser();

	const handleSearchUser = (e) => {
		e.preventDefault();
		getUserProfile(searchRef.current.value);
	};

	return (
		<>
			<Tooltip
				hasArrow
				placement='right'
				ml={1}
				openDelay={500}
				display={{ base: "block", md: "none" }}
				label="Search"
			>
				<Flex
					alignItems={"center"}
					gap={4}
					_hover={{ bg: "whiteAlpha.300" }}
					borderRadius={6}
					p={2}
					w={{ base: 10, md: "full" }}
					justifyContent={{ base: "center", md: "flex-start" }}
					cursor="pointer"
					onClick={onOpen}
				>
					<SearchLogo />
					<Box display={{ base: "none", md: "block" }}>Search</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
				<ModalOverlay bg='blackAlpha.700' backdropFilter='blur(10px)' />
				<ModalContent
					bgGradient="linear(to-br, #0A0F1F, #162447, #1F4068, #1B1B2F)"
					color="whiteAlpha.900"
					borderRadius="2xl"
					boxShadow="dark-lg"
					border="1px solid #2a2a40"
					maxW="400px"
				>
					<ModalHeader>Search User</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<form onSubmit={handleSearchUser}>
							<FormControl>
								<FormLabel>Username</FormLabel>
								<Input
									placeholder='Search by username'
									ref={searchRef}
									bg="whiteAlpha.100"
									_focus={{ borderColor: "blue.400", bg: "whiteAlpha.200" }}
									color="white"
									borderRadius="md"
								/>
							</FormControl>

							<Flex w="full" justifyContent="flex-end">
								<Button
									type="submit"
									size="sm"
									my={4}
									isLoading={isLoading}
									colorScheme="blue"
									variant="solid"
									borderRadius="md"
								>
									Search
								</Button>
							</Flex>
						</form>

						{user && <SuggestedUser user={user} setUser={setUser} />}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Search;
