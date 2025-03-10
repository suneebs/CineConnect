import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewMedia = () => {
	const [selectedFile, setSelectedFile] = useState(null); // Stores preview URL
	const [file, setFile] = useState(null); // Stores actual File object
	const [fileType, setFileType] = useState(null);
	const showToast = useShowToast();

	const maxImageSizeInBytes = 2 * 1024 * 1024; // 2MB
	const maxVideoSizeInBytes = 10 * 1024 * 1024; // 10MB

	const handleMediaChange = (e) => {
		const selected = e.target.files[0];
		if (!selected) return;

		const type = selected.type.split("/")[0]; // "image" or "video"

		if (type !== "image" && type !== "video") {
			showToast("Error", "Please select an image or video file", "error");
			setSelectedFile(null);
			setFile(null);
			return;
		}

		if (type === "image" && selected.size > maxImageSizeInBytes) {
			showToast("Error", "Image size must be less than 2MB", "error");
			setSelectedFile(null);
			setFile(null);
			return;
		}

		if (type === "video" && selected.size > maxVideoSizeInBytes) {
			showToast("Error", "Video size must be less than 10MB", "error");
			setSelectedFile(null);
			setFile(null);
			return;
		}

		setSelectedFile(URL.createObjectURL(selected)); // For preview
    setFile(selected); // Store actual file
    setFileType(type);
	};

	return { selectedFile, file, fileType, handleMediaChange, setSelectedFile, setFile };
};

export default usePreviewMedia;
