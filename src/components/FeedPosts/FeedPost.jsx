import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
	const { userProfile } = useGetUserProfileById(post.createdBy);
	const isVideo = post.type === "video";

	return (
		<>
			<PostHeader post={post} creatorProfile={userProfile} />

			<Box
				my={2}
				borderRadius={8}
				overflow="hidden"
				position="relative"
				// bg="blackAlpha.400"
				w="full"
			>
				<Box
					maxH="500px"
					w="full"
					display="flex"
					alignItems="center"
					justifyContent="center"
					overflow="hidden"
				>
					{isVideo ? (
						<video
							controls
							style={{
								maxHeight: "500px",
								width: "auto",
								maxWidth: "100%",
								objectFit: "contain",
								// borderRadius: "8px",
								// backgroundColor: "#000",
							}}
						>
							<source src={post.fileURL} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					) : (
						<Image
							src={post.fileURL}
							alt="Feed Post"
							maxH="500px"
							maxW="100%"
							// objectFit="contain"
							// borderRadius="8px"
							// background="black"
						/>
					)}
				</Box>
			</Box>

			<PostFooter post={post} creatorProfile={userProfile} />
		</>
	);
};

export default FeedPost;
