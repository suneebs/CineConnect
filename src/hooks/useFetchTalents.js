import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useFetchTalents = () => {
  const [talents, setTalents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTalents = async () => {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const talentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTalents(talentList);
    };

    fetchTalents();
  }, []);

  const filteredTalents = talents.filter((talent) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      talent.name.toLowerCase().includes(searchLower) ||
      talent.type.toLowerCase().includes(searchLower) ||
      talent.location.toLowerCase().includes(searchLower)
    );
  });

  return { talents: filteredTalents, searchQuery, setSearchQuery };
};

export default useFetchTalents;
