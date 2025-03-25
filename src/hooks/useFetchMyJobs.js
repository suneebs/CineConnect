import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";

const useFetchMyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!authUser) return;

    const fetchMyJobs = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(firestore, "jobs"),
          where("postedBy", "==", authUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyJobs(jobsData);
      } catch (error) {
        console.error("Error fetching user jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [authUser]);

  return { myJobs, loading };
};

export default useFetchMyJobs;
