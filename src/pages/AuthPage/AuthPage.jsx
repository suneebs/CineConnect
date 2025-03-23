import { Container, Flex, VStack, Box, Image } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm";

const AuthPage = () => {
	return (
		<Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4}>
			<video 
				autoPlay 
				loop 
				muted 
				playsInline
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					zIndex: -1,
					opacity: 0.2
				}}
			>
				<source src="/cineconnect_video.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<Container maxW={"container.md"} padding={0}>
				<Flex justifyContent={"center"} alignItems={"center"} gap={10}>
					{/* Left hand-side */}
					{/* <Box display={{ base: "none", md: "block" }}>
						<Image src='/auth.webp' h={600} alt='Cinema img' />
					</Box> */}

					{/* Right hand-side */}
					<VStack spacing={1} align={"stretch"}>
						<AuthForm />
						{/* <Box textAlign={"center"}>Get the app.</Box> */}
						{/* <Flex gap={5} justifyContent={"center"}>
							<Image src='/playstore.png' h={"10"} alt='Playstore logo' />
							<Image src='/microsoft.png' h={"10"} alt='Microsoft logo' />
						</Flex> */}
					</VStack>
				</Flex>
			</Container>
		</Flex>
	);
};

export default AuthPage;
