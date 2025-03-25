import { useState, useEffect } from "react";
import { firestore } from "../firebase/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobsRef = collection(firestore, "jobs");
    const q = query(jobsRef, orderBy("createdAt", "desc")); // Fetch newest jobs first

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Jobs:", fetchedJobs); // ✅ Debug log
      setJobs(fetchedJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { jobs, loading };
};

export default useFetchJobs;
