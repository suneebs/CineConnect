import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useFetchAppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setAppliedJobs([]); // Clear jobs when user logs out
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    console.log("Fetching applied jobs for user:", userId);
    
    setLoading(true);
    const jobsRef = collection(firestore, "jobs");
    const jobsQuery = query(jobsRef, where("applicants", "array-contains", userId));
  
    const unsubscribeJobs = onSnapshot(
      jobsQuery,
      (snapshot) => {
        console.log("Snapshot updated for applied jobs");
        const jobData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppliedJobs(jobData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching applied jobs:", error);
        setLoading(false);
      }
    );
  
    return () => unsubscribeJobs();
  }, [userId, appliedJobs.length]);  // ✅ Dependency added to re-fetch when appliedJobs change
  

  return { appliedJobs, loading };
};

export default useFetchAppliedJobs;
