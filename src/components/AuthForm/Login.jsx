import { Alert, AlertIcon, Button, Input, InputGroup,InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	const { loading, error, login } = useLogin();
	const [showPassword, setShowPassword] = useState(false);
	return (
		<>
			<Input
				placeholder='Email'
				fontSize={14}
				type='email'
				size={"sm"}
				value={inputs.email}
				onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				borderColor="gray.200"
				_placeholder={{ color: "gray.400" }}
			/>
			<InputGroup>
			<Input
				placeholder='Password'
				fontSize={14}
				size={"sm"}
				type={showPassword ? "text" : "password"}				value={inputs.password}
				onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				borderColor="gray.200"
				_placeholder={{ color: "gray.400" }}
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
					{error.message.split("/")[1].slice(0,-2)}
				</Alert>
			)}
			<Button
				w={"full"}
				colorScheme='blue'
				size={"sm"}
				fontSize={14}
				isLoading={loading}
				onClick={() => login(inputs)}
			>
				Log in
			</Button>
		</>
	);
};

export default Login;
