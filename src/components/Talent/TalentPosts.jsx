import { SimpleGrid, Text } from "@chakra-ui/react";
import TalentPost from "./TalentPost";

const TalentPosts = ({ talents }) => {
  return (
    <>
      {talents.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          {talents.map((talent) => (
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
