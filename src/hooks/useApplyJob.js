import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useApplyJob = () => {
  const applyForJob = async (jobId, userId, updateState) => {
    const jobRef = doc(firestore, "jobs", jobId);
    await updateDoc(jobRef, { applicants: arrayUnion(userId) });
    
    if (updateState) updateState(); // ✅ Ensure UI updates after Firestore change
  };

  const removeApplication = async (jobId, userId, updateState) => {
    const jobRef = doc(firestore, "jobs", jobId);
    await updateDoc(jobRef, { applicants: arrayRemove(userId) });
  
    if (updateState) updateState(); // ✅ Ensure UI updates after Firestore change
  };
  
  return { applyForJob, removeApplication };
};

export default useApplyJob;
