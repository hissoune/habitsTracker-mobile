"use client"

import { useAppDispatch } from "@/hooks/useAppDispatch"
import { AntDesign } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { getAllChalengesAction } from "../(redux)/chalengesSlice"
import { useRouter } from "expo-router"
import { Colors, COLORS } from "@/constants/Colors"
import { replaceIp } from "../helpers/replaceIp"

const Chalenges = () => {
  const dispatch = useAppDispatch()
  const { chalenges, isLoading } = useSelector((state: RootState) => state.chalenge)
  const router = useRouter()

  const colorScheme = useColorScheme() || "light"
  const colors = Colors[colorScheme]

  const stats = { challenges: 10, participants: 150, likes: 1200 }

  useEffect(() => {
    dispatch(getAllChalengesAction())
  }, [dispatch])

  const handelChalengeDetails = (challengeId: string) => {
    router.push(`/details/chalengeDetails?challengeId=${challengeId}`)
  }

  const renderChallenge = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handelChalengeDetails(item._id)}
      style={[styles.card, { backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#fff" }]}
    >
      <View style={styles.challengeHeader}>
        <Image source={{ uri: replaceIp(item.creator.image || "",process.env.EXPO_PUBLIC_REPLACE || "") }} style={styles.avatar} />
        <TouchableOpacity style={[styles.joinButton, { backgroundColor: COLORS.primary }]} activeOpacity={0.8}>
          <AntDesign name="deleteusergroup" size={24} color="#fff" />
        </TouchableOpacity>
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
  )

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{ uri: "https://i.pinimg.com/736x/da/44/34/da4434b3365332fcfb13be7325553cf7.jpg" }}
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient colors={["transparent", COLORS.primary]} style={styles.header}>
              <View style={styles.statsContainer}>
                {Object.entries(stats).map(([key, value]) => (
                  <View key={key} style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#fff" }]}>{value}</Text>
                    <Text style={[styles.statLabel, { color: "#fff", opacity: 0.8 }]}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Challenges</Text>
          <FlatList
            data={chalenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => (item._id ? item._id.toString() : "")}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
  },
  headerImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  headerImageStyle: {
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
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
})

export default Chalenges

