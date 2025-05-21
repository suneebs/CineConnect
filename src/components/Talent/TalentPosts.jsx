import { Box, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";
import TalentPost from "./TalentPost";
import useAuthStore from "../../store/authStore";

const TalentPosts = ({ talents, isLoading }) => {
  const authUser = useAuthStore((state) => state.user);

  // ✅ Exclude the logged-in user's profile
  const filteredTalents = talents.filter((talent) => talent.uid !== authUser?.uid);

  return (
    <>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        {isLoading &&
          [0, 1, 2, 3, 4, 5].map((_, idx) => (
            <VStack key={idx} alignItems={"flex-start"} gap={4}>
              <Skeleton w="full" borderRadius="md">
                <Box h={{base:"180px",sm:"320px"}} w="full" />
              </Skeleton>
            </VStack>
          ))}

        {!isLoading &&
          filteredTalents.map((talent) => (
            <TalentPost key={talent.id} talent={talent} />
          ))}
      </Grid>

      {!isLoading && filteredTalents.length === 0 && (
        <Text textAlign="center" mt={6} color="gray.500">
          No talents found.
        </Text>
      )}
    </>
  );
};

export default TalentPosts;
