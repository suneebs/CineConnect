import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useApplyJob = () => {
  const applyForJob = async (jobId, applicant) => {
    try {
      const jobRef = doc(firestore, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);
      
      if (jobSnap.exists()) {
        const jobData = jobSnap.data();
        const existingApplicants = jobData.applicants || [];
        
        if (existingApplicants.some(a => a.uid === applicant.uid)) {
          console.warn("User has already applied for this job.");
          return;
        }

        await updateDoc(jobRef, {
          applicants: arrayUnion(applicant),
        });
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  return applyForJob;
};

export default useApplyJob;
