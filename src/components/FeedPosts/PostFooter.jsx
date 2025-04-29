import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import usePostComment from "../../hooks/usePostComment";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import CommentsModal from "../Modals/CommentsModal";

const PostFooter = ({ post, isProfilePage, creatorProfile }) => {
	const { isCommenting, handlePostComment } = usePostComment();
	const [comment, setComment] = useState("");
	const authUser = useAuthStore((state) => state.user);
	const commentRef = useRef(null);
	const { handleLikePost, isLiked, likes } = useLikePost(post);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleSubmitComment = async () => {
		if(comment === "") return;
		await handlePostComment(post.id, comment);
		setComment("");
	};

	return (
		<Box mb={4} marginTop={"auto"}>
			<Flex alignItems={"center"} gap={4} w={"full"} >
				<Box onClick={handleLikePost} cursor={"pointer"}>
					{!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
				</Box>

				<Box cursor={"pointer"} onClick={() => commentRef.current.focus()}>
					<CommentLogo />
				</Box>
			</Flex>
			<Text fontWeight={600} fontSize={{base:"xs",sm:"sm"}}>
				{likes} likes
			</Text>

			{isProfilePage && (
				<Text fontSize={{base:'10',sm:'12'}} color={"gray"}>
					Posted {timeAgo(post.createdAt)}
				</Text>
			)}

			{!isProfilePage && (
				<>
					<Text fontSize={{base:'xs',sm:'sm'}} fontWeight={700}>
						{creatorProfile?.username}{" "}
						<Text as='span' fontWeight={400}>
							{post.caption}
						</Text>
					</Text>
					{post.comments.length > 0 && (
						<Text fontSize={{base:'xs',sm:'sm'}} color={"gray"} cursor={"pointer"} onClick={onOpen}>
							View all {post.comments.length} comments
						</Text>
					)}
					{/* COMMENTS MODAL ONLY IN THE HOME PAGE */}
					{isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null}
				</>
			)}

			{authUser && (
				<Flex alignItems={"center"} gap={2} justifyContent={"space-between"} w={"full"}>
					<InputGroup>
						<Input
							variant={"flushed"}
							placeholder={"Add a comment..."}
							fontSize={14}
							onChange={(e) => setComment(e.target.value)}
							value={comment}
							ref={commentRef}
						/>
						<InputRightElement>
							<Button
								fontSize={14}
								color={"blue.500"}
								fontWeight={600}
								cursor={"pointer"}
								_hover={{ color: "white" }}
								bg={"transparent"}
								onClick={handleSubmitComment}
								isLoading={isCommenting}
							>
								Post
							</Button>
						</InputRightElement>
					</InputGroup>
				</Flex>
			)}
		</Box>
	);
};

export default PostFooter;
