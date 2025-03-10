import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewMedia = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileType, setFileType] = useState(null);
	const showToast = useShowToast();

	// File size limits: 2MB for images, 10MB for videos
	const maxImageSizeInBytes = 2 * 1024 * 1024; // 2MB
	const maxVideoSizeInBytes = 10 * 1024 * 1024; // 10MB

	const handleMediaChange = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		const type = file.type.split("/")[0]; // "image" or "video"

		if (type !== "image" && type !== "video") {
			showToast("Error", "Please select an image or video file", "error");
			setSelectedFile(null);
			return;
		}

		if (type === "image" && file.size > maxImageSizeInBytes) {
			showToast("Error", "Image size must be less than 2MB", "error");
			setSelectedFile(null);
			return;
		}

		if (type === "video" && file.size > maxVideoSizeInBytes) {
			showToast("Error", "Video size must be less than 10MB", "error");
			setSelectedFile(null);
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setSelectedFile(reader.result);
			setFileType(type);
		};
		reader.readAsDataURL(file);
	};

	return { selectedFile, fileType, handleMediaChange, setSelectedFile };
};

export default usePreviewMedia;
