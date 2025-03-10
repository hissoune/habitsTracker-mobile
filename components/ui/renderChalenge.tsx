import  replaceIp  from "@/app/helpers/replaceIp";
import { COLORS, Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type ChallengeCardProps = {
  item: any;
}

export const ChallengeCard = ({ item }: ChallengeCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  const handleChallengeDetails = (challengeId: string) => {
    router.push(`/details/chalengeDetails?challengeId=${challengeId}`);
  };

  return (
    <TouchableOpacity
      onPress={() => handleChallengeDetails(item._id)}
      style={[styles.card, { backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#fff" }]}
    >
      <View style={styles.challengeHeader}>
        <Image source={{ uri: replaceIp(item.creator.image || "", process.env.EXPO_PUBLIC_REPLACE || "") }} style={styles.avatar} />
        
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: colors.text, opacity: 0.8 }]}>{item.description}</Text>
      <Text style={[styles.creator, { color: colors.text, opacity: 0.6 }]}>By: {item.creator.name}</Text>
      <Text style={[styles.participants, { color: colors.text, opacity: 0.6 }]}>
        Participants:{" "}
        {item.participants.length > 0
          ? `${item.participants[item.participants.length - 1].userDetails.name} ${(item.participants.length - 1) != 0 ? "+" + (item.participants.length - 1) : ""}`
          : "No participants yet"}
      </Text>
      <Text style={[styles.stats, { color: colors.text, opacity: 0.6 }]}>
        👍 {item.likes} | 👎 {item.dislikes} | ⭐ {item.favorites}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  joinButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  creator: {
    fontSize: 12,
    marginBottom: 8,
  },
  participants: {
    fontSize: 12,
    marginBottom: 8,
  },
  stats: {
    fontSize: 12,
  },
});