import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
	const { userProfile } = useGetUserProfileById(post.createdBy);

	// Determine if the media is a video
	const isVideo = post.type === "video";
	// console.log("isVideo", isVideo);

	return (
		<>
			<PostHeader post={post} creatorProfile={userProfile} />
			<Box my={2} borderRadius={4} overflow={"hidden"}>
				{isVideo ? (
					<video controls width="100%" style={{ borderRadius: "4px" }}>
						<source src={post.fileURL} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				) : (
					<Image src={post.fileURL} alt={"FEED POST IMG"} />
				)}
			</Box>
			<PostFooter post={post} creatorProfile={userProfile} />
		</>
	);
};

export default FeedPost;
