import { Box } from "@chakra-ui/react";
import TalentHeader from "../../components/Talent/TalentHeader";
import TalentPosts from "../../components/Talent/TalentPosts";
import useFetchTalents from "../../hooks/useFetchTalents";

const TalentPage = () => {
  const { talents, searchQuery, setSearchQuery, loading  } = useFetchTalents();

  return (
    <Box maxW="900px" mx="auto" p={4}>
      <TalentHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <TalentPosts talents={talents} isLoading={loading} />
    </Box>
  );
};

export default TalentPage;
