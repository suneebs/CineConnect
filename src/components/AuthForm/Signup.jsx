import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Alert,
	AlertIcon,
	Button,
	Input,
	InputGroup,
	InputRightElement,
	Tag,
	TagCloseButton,
	TagLabel,
	VStack,
	Box,
	List,
	ListItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const professionsList = [
	"Actor", "Director", "Producer", "Screenwriter", "Dialogue Writer",
	"Storyboard Artist", "Casting Director", "Choreographer", "Fight Choreographer",
	"Stunt Performer", "Voice Actor", "Dancer",

	// Technical Roles
	"Cinematographer (Director of Photography)", "Camera Operator", 
	"Assistant Camera (Focus Puller)", "Drone Operator", "Steadicam Operator",
	"Gaffer (Lighting Head)", "Key Grip (Rigging & Equipment)", "Best Boy (Lighting Assistant)", 
	"Sound Designer", "Sound Mixer", "Boom Operator", "Foley Artist", "Film Editor", 
	"Visual Effects (VFX) Supervisor", "VFX Artist", "Colorist", "Title Designer", 
	"Motion Graphics Designer", "Subtitling & Dubbing Artist",

	// Art & Set Design
	"Production Designer", "Art Director", "Set Decorator", "Props Master", 
	"Makeup Artist", "Hair Stylist", "Costume Designer", "Wardrobe Stylist",

	// Production & Management
	"Executive Producer", "Line Producer", "Production Manager", "Location Manager", 
	"Public Relations (PR) Manager", "Film Distributor", "Marketing Manager", 
	"Theater Manager", "Film Festival Director", "Film Critic/Reviewer", "Legal Advisor"
];

const Signup = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		email: "",
		password: "",
		location: "",
		profession: [],
	});
	const [showPassword, setShowPassword] = useState(false);
	const [locationSuggestions, setLocationSuggestions] = useState([]);
	const [professionInput, setProfessionInput] = useState("");
	const [professionSuggestions, setProfessionSuggestions] = useState([]);

	const { loading, error, signup } = useSignUpWithEmailAndPassword();

	// Fetch previously entered locations from Firestore
	useEffect(() => {
		const fetchLocations = async () => {
			const usersRef = collection(firestore, "users");
			const querySnapshot = await getDocs(usersRef);
			const locations = new Set();
			querySnapshot.forEach((doc) => {
				if (doc.data().location) locations.add(doc.data().location);
			});
			setLocationSuggestions(Array.from(locations));
		};
		fetchLocations();
	}, []);

	// Update profession suggestions dynamically
	useEffect(() => {
		if (professionInput) {
			const filtered = professionsList.filter((prof) =>
				prof.toLowerCase().includes(professionInput.toLowerCase())
			);
			setProfessionSuggestions(filtered);
		} else {
			setProfessionSuggestions([]);
		}
	}, [professionInput]);

	// Add profession dynamically
	const addProfession = (profession) => {
		if (!profession || inputs.profession.includes(profession)) return;

		setInputs((prev) => ({
			...prev,
			profession: [...prev.profession, profession],
		}));
		setProfessionInput(""); // Clear input
		setProfessionSuggestions([]); // Clear suggestions
	};

	// Remove profession from list
	const removeProfession = (profession) => {
		setInputs((prev) => ({
			...prev,
			profession: prev.profession.filter((p) => p !== profession),
		}));
	};

	// Handle Enter Key Press
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Prevent form submission
			addProfession(professionInput.trim());
		}
	};

	return (
		<>
			<Input
				placeholder='Email'
				fontSize={14}
				type='email'
				size={"sm"}
				value={inputs.email}
				onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
			/>
			<Input
				placeholder='Username'
				fontSize={14}
				type='text'
				size={"sm"}
				value={inputs.username}
				onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
			/>
			<Input
				placeholder='Full Name'
				fontSize={14}
				type='text'
				size={"sm"}
				value={inputs.fullName}
				onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
			/>

			{/* Location Input with Suggestions */}
			<Input
				placeholder='Location'
				fontSize={14}
				type='text'
				size={"sm"}
				list="location-suggestions"
				value={inputs.location}
				onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
			/>
			<datalist id="location-suggestions">
				{locationSuggestions.map((loc, index) => (
					<option key={index} value={loc} />
				))}
			</datalist>

			{/* Profession Input with Searchable Suggestions */}
			<Box position="relative" width={"100%"}>
				<Input
					placeholder='Add profession'
					fontSize={14}
					type='text'
					size={"sm"}
					value={professionInput}
					onChange={(e) => setProfessionInput(e.target.value)}
					onKeyDown={handleKeyDown} // Allow Enter key
				/>
				{/* Custom Profession Suggestions Box */}
				{professionSuggestions.length > 0 && (
					<List
						position="absolute"
						bg="white"
						border="1px solid #ddd"
						boxShadow="md"
						width="100%"
						maxH="150px"
						overflowY="auto"
						mt={1}
						zIndex={10}
					>
						{professionSuggestions.map((prof, index) => (
							<ListItem
								key={index}
								p={2}
								_hover={{ backgroundColor: "gray.500", cursor: "pointer",color:"black" }}
								onClick={() => addProfession(prof)}
								background={"black"}
							>
								{prof}
							</ListItem>
						))}
					</List>
				)}
			</Box>

			{/* Display Added Professions as Tags */}
			<VStack align="start" mt={2}>
				{inputs.profession.map((profession, index) => (
					<Tag key={index} size="md" variant="solid" colorScheme="blue">
						<TagLabel>{profession}</TagLabel>
						<TagCloseButton onClick={() => removeProfession(profession)} />
					</Tag>
				))}
			</VStack>

			<InputGroup>
				<Input
					placeholder='Password'
					fontSize={14}
					type={showPassword ? "text" : "password"}
					value={inputs.password}
					size={"sm"}
					onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				/>
				<InputRightElement h='full'>
					<Button variant={"ghost"} size={"sm"} onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</Button>
				</InputRightElement>
			</InputGroup>

			{error && (
				<Alert status='error' fontSize={13} p={2} borderRadius={4}>
					<AlertIcon fontSize={12} />
					{error.message.split("/")[1].slice(0, -2)}
				</Alert>
			)}

			<Button
				w={"full"}
				colorScheme='blue'
				size={"sm"}
				fontSize={14}
				isLoading={loading}
				onClick={() => signup(inputs)}
			>
				Sign Up
			</Button>
		</>
	);
};

export default Signup;
