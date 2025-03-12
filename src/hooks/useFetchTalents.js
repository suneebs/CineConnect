import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const useFetchTalents = () => {
  const [talents, setTalents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const talentsCollection = collection(firestore, "users"); // Adjust the collection name
        const snapshot = await getDocs(talentsCollection);
        const talentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTalents(talentsList);
      } catch (error) {
        console.error("Error fetching talents:", error);
      }
    };

    fetchTalents();
  }, []);

  // ✅ Search filter logic
  const filteredTalents = talents.filter((talent) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      talent.username.toLowerCase().includes(query) || // Search by username
      talent.location?.toLowerCase().includes(query) || // Search by location
      (Array.isArray(talent.profession) && 
        talent.profession.some((prof) => prof.toLowerCase().includes(query))) // Search by profession
    );
  });

  return { talents: filteredTalents, searchQuery, setSearchQuery };
};

export default useFetchTalents;
