import { useState } from "react";
import {
	Avatar,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
} from "@chakra-ui/react";
import useEditProfile from "../../hooks/useEditProfile";
import useUserProfileStore from "../../store/userProfileStore";

const EditProfile = ({ isOpen, onClose }) => {
	const { editProfile, isUpdating } = useEditProfile();
	const { userProfile } = useUserProfileStore();

	const [inputs, setInputs] = useState({
		fullName: userProfile?.fullName || "",
		username: userProfile?.username || "",
		bio: userProfile?.bio || "",
		location: userProfile?.location || "",
		profession: Array.isArray(userProfile?.profession) ? userProfile.profession.join(", ") : userProfile?.profession || "",
	});

	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(userProfile?.profilePicURL || "");

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setPreview(URL.createObjectURL(selectedFile));
		}
	};

	const handleSubmit = async () => {
		const updatedInputs = {
			...inputs,
			profession: inputs.profession.split(",").map((item) => item.trim()), // Convert comma-separated string to array
		};

		await editProfile(updatedInputs, file);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
			<ModalOverlay />
			<ModalContent
			bgGradient="linear(to-br, #0A0F1F, #162447, #1F4068, #1B1B2F)"
					color="whiteAlpha.900"
					borderRadius="2xl"
					boxShadow="dark-lg"
					border="1px solid #2a2a40"
					>
				<ModalHeader>Edit Profile</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					<Flex direction="column" alignItems="center" mb={4}>
						<Avatar src={preview} size="xl" mb={2} />
						<Button as="label" htmlFor="file-upload" size="sm" colorScheme="blue">
							Change Profile Picture
						</Button>
						<Input id="file-upload" type="file" hidden accept="image/*" onChange={handleFileChange} />
					</Flex>

					<FormControl>
						<FormLabel fontSize={"sm"}>Full Name</FormLabel>
						<Input
							placeholder="Full Name"
							size="sm"
							type="text"
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</FormControl>

					<FormControl mt={2}>
						<FormLabel fontSize={"sm"}>Username</FormLabel>
						<Input
							placeholder="Username"
							size="sm"
							type="text"
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</FormControl>

					<FormControl mt={2}>
						<FormLabel fontSize={"sm"}>Bio</FormLabel>
						<Textarea
							placeholder="Tell us about yourself..."
							size="sm"
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
						/>
					</FormControl>

					<FormControl mt={2}>
						<FormLabel fontSize={"sm"}>Location</FormLabel>
						<Input
							placeholder="Location"
							size="sm"
							type="text"
							value={inputs.location}
							onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
						/>
					</FormControl>

					<FormControl mt={2}>
						<FormLabel fontSize={"sm"}>Profession</FormLabel>
						<Input
							placeholder="Profession (e.g., Actor, Director, Writer)"
							size="sm"
							type="text"
							value={inputs.profession}
							onChange={(e) => setInputs({ ...inputs, profession: e.target.value })}
						/>
						<Text fontSize="xs" color="gray.500" mt={1}>
							Separate multiple professions with commas (e.g., "Actor, Director")
						</Text>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button onClick={onClose} mr={3} size="sm">
						Cancel
					</Button>
					<Button colorScheme="blue" onClick={handleSubmit} isLoading={isUpdating} size="sm">
						Save Changes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default EditProfile;
