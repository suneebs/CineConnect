import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVEQ6dAnelY4K4pJw0s2VGv3KoGohe3XU",
  authDomain: "dineease-4184d.firebaseapp.com",
  projectId: "dineease-4184d",
  storageBucket: "dineease-4184d.appspot.com",
  messagingSenderId: "581065440383",
  appId: "1:581065440383:web:c5e8ad98b8bf1d555ed34a",
  measurementId: "G-G04Q8Z7D0N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
