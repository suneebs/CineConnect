import {
	Box,
	Button,
	CloseButton,
	Flex,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { MdPermMedia } from "react-icons/md";
import { useRef, useState } from "react";
import usePreviewMedia from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [caption, setCaption] = useState("");
	const fileRef = useRef(null);
	const { handleMediaChange, selectedFile, fileType, file, setSelectedFile } = usePreviewMedia();
	const showToast = useShowToast();
	const { isLoading, handleCreatePost } = useCreatePost();

	const handlePostCreation = async () => {
		try {
			await handleCreatePost(file, fileType, caption);
			onClose();
			setCaption("");
			setSelectedFile(null);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<>
			<Tooltip hasArrow placement="right" ml={1} openDelay={500} display={{ base: "block", md: "none" }}>
				<Flex alignItems={"center"} gap={4} _hover={{ bg: "whiteAlpha.400" }} borderRadius={6} p={2} w={{ base: 10, md: "full" }}
					justifyContent={{ base: "center", md: "flex-start" }} onClick={onOpen}>
					<CreatePostLogo />
					<Box display={{ base: "none", md: "block" }}>Create Post</Box>
				</Flex>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
	<ModalOverlay />
	<ModalContent
		bgGradient="linear(to-br, #0A0F1F, #162447, #1F4068, #1B1B2F)"
		color="whiteAlpha.900"
		borderRadius="2xl"
		shadow="xl"
		border="1px solid rgba(255, 255, 255, 0.08)"
	>
		<ModalHeader fontSize="2xl" fontWeight="bold">
			Create Post
		</ModalHeader>
		<ModalCloseButton color="whiteAlpha.700" />
		<ModalBody pb={6}>
			<Textarea
				placeholder="Write your thoughts..."
				_focus={{ borderColor: "whiteAlpha.500", boxShadow: "0 0 0 1px whiteAlpha.500" }}
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
				color="white"
				bg="whiteAlpha.100"
				border="1px solid"
				borderColor="whiteAlpha.200"
				_hover={{ borderColor: "whiteAlpha.400" }}
			/>

			<Input
				type="file"
				hidden
				ref={fileRef}
				onChange={handleMediaChange}
				accept="image/*,video/*"
			/>

			<Flex mt={4} gap={4} alignItems="center">
				<Button
					leftIcon={<MdPermMedia />}
					onClick={() => fileRef.current.click()}
					variant="outline"
					colorScheme="blue"
					border="1px solid"
					borderColor="whiteAlpha.300"
					_hover={{ bg: "whiteAlpha.200" }}
				>
					Add Media
				</Button>
			</Flex>

			{selectedFile && (
				<Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
					{fileType === "image" ? (
						<Image
							src={selectedFile}
							alt="Selected media"
							borderRadius="lg"
							maxH="300px"
							objectFit="cover"
							boxShadow="lg"
						/>
					) : (
						<video
							src={selectedFile}
							controls
							style={{ maxWidth: "100%", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}
						/>
					)}
					<CloseButton
						position="absolute"
						top={2}
						right={2}
						color="whiteAlpha.800"
						bg="blackAlpha.600"
						borderRadius="full"
						_hover={{ bg: "blackAlpha.800" }}
						onClick={() => setSelectedFile(null)}
					/>
				</Flex>
			)}
		</ModalBody>

		<ModalFooter>
			<Button
				colorScheme="blue"
				mr={3}
				isLoading={isLoading}
				onClick={handlePostCreation}
				bg="blue.500"
				_hover={{ bg: "blue.600" }}
				color="white"
				borderRadius="md"
				px={6}
			>
				Post
			</Button>
			<Button variant="ghost" onClick={onClose} color="whiteAlpha.700">
				Cancel
			</Button>
		</ModalFooter>
	</ModalContent>
</Modal>

		</>
	);
};

export default CreatePost;

function useCreatePost() {
	const showToast = useShowToast();
	const [isLoading, setIsLoading] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const createPost = usePostStore((state) => state.createPost);
	const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);
	const { pathname } = useLocation();

	const handleCreatePost = async (file, fileType, caption) => {
		if (isLoading) return;
		if (!file) throw new Error("Please select an image or video");
		setIsLoading(true);

		const newPost = {
			caption: caption,
			likes: [],
			comments: [],
			createdAt: Date.now(),
			createdBy: authUser.uid,
			type: fileType,
		};

		try {
			const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
			const userDocRef = doc(firestore, "users", authUser.uid);
			const fileRef = ref(storage, `posts/${postDocRef.id}`);

			await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
			await uploadBytes(fileRef, file);
			const downloadURL = await getDownloadURL(fileRef);

			await updateDoc(postDocRef, { fileURL: downloadURL });

			newPost.fileURL = downloadURL;
			if (userProfile.uid === authUser.uid) createPost({ ...newPost, id: postDocRef.id });

			if (pathname !== "/" && userProfile.uid === authUser.uid) addPost({ ...newPost, id: postDocRef.id });

			showToast("Success", "Post created successfully", "success");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleCreatePost };
}
