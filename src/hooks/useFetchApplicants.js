import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const useFetchApplicants = (jobId) => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (!jobId) return;

    const fetchApplicants = async () => {
      try {
        const jobRef = doc(firestore, "jobs", jobId);
        const jobSnap = await getDoc(jobRef);

        if (jobSnap.exists()) {
          setApplicants(jobSnap.data().applicants || []);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return applicants;
};

export default useFetchApplicants;
