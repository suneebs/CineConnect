import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const useFetchTalents = () => {
  const [talents, setTalents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // ⬅️ Add loading state

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true); // ⬅️ Start loading
        const talentsCollection = collection(firestore, "users");
        const snapshot = await getDocs(talentsCollection);
        const talentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTalents(talentsList);
      } catch (error) {
        console.error("Error fetching talents:", error);
      } finally {
        setLoading(false); // ⬅️ Stop loading
      }
    };

    fetchTalents();
  }, []);

  const filteredTalents = talents.filter((talent) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      talent.username.toLowerCase().includes(query) ||
      talent.location?.toLowerCase().includes(query) ||
      (Array.isArray(talent.profession) &&
        talent.profession.some((prof) => prof.toLowerCase().includes(query)))
    );
  });

  return {
    talents: filteredTalents,
    searchQuery,
    setSearchQuery,
    loading, // ⬅️ Expose loading
  };
};

export default useFetchTalents;
