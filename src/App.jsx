import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import TalentPage from "./pages/TalentPage/TalentPage";
import useUserProfileStore from "./hooks/useUserProfileStore";
import ChatPage from "./pages/chatPage/ChatPage";
import JobPage from "./pages/JobPage/JobPage";

function App() {
	const [authUser] = useAuthState(auth);
	const fetchUserProfile = useUserProfileStore((state) => state.fetchUserProfile);

	// Fetch user profile when authUser is available
	useEffect(() => {
		if (authUser?.uid) {
			fetchUserProfile(authUser.uid);
		}
	}, [authUser, fetchUserProfile]);

	return (
			<PageLayout>
				<Routes>
					<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/auth' />} />
					<Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' />} />
					<Route path='/:username' element={<ProfilePage />} />
					<Route path='/talents' element={<TalentPage />} />
					<Route path='/jobs' element={<JobPage />} />
					<Route path='/messages' element={authUser ? <ChatPage /> : <Navigate to='/auth' />} />
					<Route path='/chat/:chatId' element={authUser ? <ChatPage /> : <Navigate to='/auth' />} />
				</Routes>
			</PageLayout>
	);
}

export default App;
