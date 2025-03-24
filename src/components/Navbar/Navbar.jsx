import { Button, Container, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { CineConnectLogo } from "../../assets/constants";

const Navbar = () => {
	return (
		<Container maxW={"container.lg"} my={4}>
			<Flex w={"full"} justifyContent={{ base: "center", sm: "space-between" }} alignItems={"center"}>
				<Flex p={2} alignItems={"center"} mt={5}>
				<CineConnectLogo/>
				</Flex>
				<Flex gap={4}>
					<Link to='/auth'>
						<Button colorScheme={"blue"} size={"sm"}>
							Login
						</Button>
					</Link>
					<Link to='/auth'>
						<Button variant={"outline"} size={"sm"}>
							Signup
						</Button>
					</Link>
				</Flex>
			</Flex>
		</Container>
	);
};

export default Navbar;
