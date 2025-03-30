import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser; // ✅ Get logged-in user

  useEffect(() => {
    if (!currentUser) return; // ✅ Ensure user is logged in

    const jobsRef = collection(firestore, "jobs");
    const jobsQuery = query(jobsRef, where("userId", "!=", currentUser.uid)); // ✅ Exclude own jobs

    const unsubscribe = onSnapshot(jobsQuery, (snapshot) => {
      const jobData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { jobs, loading };
};

export default useFetchJobs;
