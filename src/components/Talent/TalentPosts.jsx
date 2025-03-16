import { SimpleGrid, Text } from "@chakra-ui/react";
import TalentPost from "./TalentPost";
import useAuthStore from "../../store/authStore";

const TalentPosts = ({ talents }) => {
  const authUser = useAuthStore((state) => state.user);

  // ✅ Exclude the logged-in user's profile
  const filteredTalents = talents.filter((talent) => talent.uid !== authUser?.uid);

  return (
    <>
      {filteredTalents.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          {filteredTalents.map((talent) => (
            <TalentPost key={talent.id} talent={talent} />
          ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" mt={4}>
          No talents found.
        </Text>
      )}
    </>
  );
};

export default TalentPosts;
