import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuth from "./useAuth"; // Import useAuth to get user

const useFetchMyJobs = () => {
  const { user } = useAuth(); // Get logged-in user
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const jobsRef = collection(firestore, "jobs");
    const q = query(jobsRef, where("userId", "==", user.uid));

    // ✅ Real-time listener for job updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyJobs(jobs);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [user]);

  return { myJobs, loading };
};

export default useFetchMyJobs;
