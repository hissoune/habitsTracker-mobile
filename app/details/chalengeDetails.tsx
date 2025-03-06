"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  useColorScheme,
} from "react-native"
import { FontAwesome, MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS, Colors } from "@/constants/Colors"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { joinChalengeAction } from "../(redux)/chalengesSlice"
import { chalenge } from "@/constants/types"
import { Image } from "react-native"
import { replaceIp } from "../helpers/replaceIp"



const { width } = Dimensions.get("window")

const ChallengeDetails = () => {
  const { challengeId } = useLocalSearchParams()
  const { chalenges } = useSelector((state: RootState) => state.chalenge)
  const { user } = useSelector((state: RootState) => state.auth)
  const [challenge, setChallenge] = useState<chalenge | undefined>(chalenges.find((ch) => ch._id === challengeId))
  const [isParticipant, setIsParticipant] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const colorScheme = useColorScheme() || 'light'
  const colors = Colors[colorScheme]
  
  const scaleAnim = useState(new Animated.Value(1))[0]

  const currentUserId = user?._id

  useEffect(() => {
    const currentChallenge = chalenges.find((ch) => ch._id === challengeId)
    if (currentChallenge) {
      setChallenge({ ...currentChallenge })
      setIsParticipant(!!currentChallenge.participants?.some((p) => p.userId === currentUserId))
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [challengeId, chalenges, scaleAnim, currentUserId]) 

  const handleJoinChallenge = async (chalengeId:string) => {
    await dispatch(joinChalengeAction(chalengeId))
    console.log("Joining challenge:", challengeId)
    setIsParticipant(true)
  }

  const calculateDaysLeft = () => {
    if (!challenge?.endDate) return 0
    const endDate = new Date(challenge.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const daysLeft = calculateDaysLeft()

  if (!challenge) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  const renderParticipant = ({ item, index }: { item: { userId: string; progress: number,userDetails:any }; index: number }) => (
    <ScrollView horizontal contentContainerStyle={[styles.participantContainer, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
      <View style={styles.participantInfo}>
        <View style={[styles.participantRank, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]}>
          <Text style={[styles.rankText, { color: colors.text }]}>{index + 1}</Text>
        </View>
     <Image source={{ uri: replaceIp(item.userDetails.image,process.env.EXPO_PUBLIC_REPLACE || "")  }} style={styles.avatar} />    
     <Text style={[styles.participantName, { color: colors.text }]}>{item.userDetails.name}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${item.progress}%`,
                backgroundColor: item.progress > 75 ? "#4CAF50" : item.progress > 40 ? "#FFC107" : COLORS.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.participantProgress, { color: colors.text }]}>{item.progress}%</Text>
      </View>
    </ScrollView>
  )

  const gradientColors: [string, string] = colorScheme === 'dark' 
    ? ["rgba(21, 23, 24, 0.9)", "rgba(15, 17, 18, 1)"] 
    : ["rgba(255, 255, 255, 0.9)", "rgba(240, 240, 240, 1)"]

  return (
    <ScrollView
      style={[styles.backgroundContainer, { backgroundColor: colors.background }]}
    >
      <LinearGradient colors={gradientColors} style={styles.overlay}>
        <TouchableOpacity 
          style={[styles.backButton, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
          }]} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </TouchableOpacity>

        <View style={styles.container}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: colors.text }]}>{challenge.title}</Text>
            <View style={styles.statsContainer}>
              <View style={[styles.statItem, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                <MaterialIcons name="people" size={20} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.text }]}>{challenge.participants?.length || 0} Participants</Text>
              </View>
              <View style={[styles.statItem, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                <MaterialIcons name="timer" size={20} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.text }]}>{daysLeft} Days Left</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)' 
          }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About this Challenge</Text>
            <Text style={[styles.description, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>{challenge.description}</Text>

            <View style={styles.dateSection}>
              <View style={[styles.dateContainer, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(240, 240, 240, 0.8)' 
              }]}>
                <MaterialIcons name="event-available" size={22} color={COLORS.primary} />
                <View>
                  <Text style={[styles.dateLabel, { color: colorScheme === 'dark' ? '#ccc' : '#777' }]}>Start Date</Text>
                  <Text style={[styles.dateText, { color: colors.text }]}>{new Date(challenge.startDate).toLocaleDateString()}</Text>
                </View>
              </View>
              <View style={[styles.dateContainer, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(240, 240, 240, 0.8)' 
              }]}>
                <MaterialIcons name="event" size={22} color="#FF5252" />
                <View>
                  <Text style={[styles.dateLabel, { color: colorScheme === 'dark' ? '#ccc' : '#777' }]}>End Date</Text>
                  <Text style={[styles.dateText, { color: colors.text }]}>{new Date(challenge.endDate).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.leaderboardCard, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)' 
          }]}>
            <View style={styles.leaderboardHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Leaderboard</Text>
              <AntDesign name="Trophy" size={24} color="#FFD700" />
            </View>

            {challenge.participants && challenge.participants.length > 0 ? (
              <FlatList
                data={[...challenge.participants].filter((p): p is { userId: string; progress: number; userDetails: any } => !!p.userDetails).sort((a, b) => b.progress - a.progress)}
                renderItem={renderParticipant}
                keyExtractor={(item) => item.userId}
                contentContainerStyle={styles.participantList}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyLeaderboard}>
                <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#ccc' : '#777' }]}>No participants yet. Be the first to join!</Text>
              </View>
            )}
          </View>

          {!isParticipant && (
            <Animated.View style={[styles.joinButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity style={styles.joinButton} onPress={()=>{ if (challenge?._id) handleJoinChallenge(challenge._id) }} activeOpacity={0.8}>
                <Text style={styles.joinButtonText}>Join Challenge</Text>
                <AntDesign name="arrowright" size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statText: {
    marginLeft: 5,
    fontWeight: "600",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    width: "48%",
  },
  dateLabel: {
    fontSize: 12,
    marginLeft: 8,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  leaderboardCard: {
    borderRadius: 16,
    padding: 20,
    flex: 1,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  participantContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantRank: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  participantName: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.35,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  participantProgress: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "bold",
    width: 40,
    textAlign: "right",
  },
  participantList: {
    paddingBottom: 20,
  },
  emptyLeaderboard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  joinButtonContainer: {
    marginVertical: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    width: width * 0.8,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor:"#000",
    borderWidth:1,
  },
})

export default ChallengeDetails
