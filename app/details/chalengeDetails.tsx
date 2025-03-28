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
import { FontAwesome, MaterialIcons, Ionicons, AntDesign, Feather, MaterialCommunityIcons, Octicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { LinearGradient } from "expo-linear-gradient"
import { COLORS, Colors } from "@/constants/Colors"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { compleeteProgressAction, deleteChalengeAction, getParticipantProgressAction, joinChalengeAction, updateChalengeActon } from "../(redux)/chalengesSlice"
import { chalenge, User } from "@/constants/types"
import React from "react"
import RenderParticipant from "../../components/renderParticipants"
import UsersSelector from "@/components/usersSelector"
import ChallengeCreation from "@/components/chalengeCreation"



const { width } = Dimensions.get("window")

const ChallengeDetails = () => {
  const { challengeId } = useLocalSearchParams()
  const { chalenges ,progress} = useSelector((state: RootState) => state.chalenge)
  const { user } = useSelector((state: RootState) => state.auth)
  const [challenge, setChallenge] = useState<chalenge | undefined>(chalenges.find((ch) => ch._id === challengeId))
  const [isParticipant, setIsParticipant] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isUserSelector,setIsUserSelector]=useState(false)
  const colorScheme = useColorScheme() || 'light'
  const colors = Colors[colorScheme]
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scaleAnim = useState(new Animated.Value(1))[0]

  const currentUserId = user?._id

  const [userProgress,setUserProgress] = useState(0)

  useEffect(() => {
    const currentChallenge = chalenges.find((ch) => ch._id === challengeId)
    if (currentChallenge) {
      setChallenge({ ...currentChallenge })
      const participant = currentChallenge.participants?.find((p) => p.userId === currentUserId);
      setIsParticipant(!!participant);
      
      if (participant) {
        setUserProgress(participant.progress || 0); 
      }    }

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
  }, [challengeId, chalenges, scaleAnim, currentUserId]) ;

  useEffect(()=>{
 
    if (challenge?._id) {
       dispatch(getParticipantProgressAction(challenge?._id))
    }

  },[challenge,chalenges])

const handelAddParticipants =  (participants:any)=>{
  if (challenge?._id) {
    dispatch(updateChalengeActon({ chalengeId: challenge._id, chalenge: { participants } }))
  }

}

  const handleJoinChallenge = async (chalengeId:string) => {
    await dispatch(joinChalengeAction(chalengeId))
    console.log("Joining challenge:", challengeId)
    setIsParticipant(true)
  }

  const handleMarkAsCompleted = () => {
    if (progress?._id) {
      dispatch(compleeteProgressAction(progress?._id))
    }
    
    console.log("Marked as completed")
  }

  const handelDeleteChallenge =()=>{
    try {
    if (challenge?._id) {
      dispatch(deleteChalengeAction( challenge?._id));
      router.push('/(tabs)/chalenges')

    }
  } catch (error) {
    console.error("Failed to delete chalenge:", error) 
  }
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
          <Ionicons name="arrow-back" size={28} color={colors.icon} />
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
            <View style={styles.statsContainer}>
              <View style={[styles.statItem, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                <FontAwesome name="calendar" size={20} color={colors.icon} />
                <Text style={[styles.statText, { color: colors.text }]}>{challenge.frequency.charAt(0).toUpperCase() + challenge.frequency.slice(1)} </Text>
              </View>
              <View style={[styles.statItem, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                <Ionicons name="repeat" size={24} color={COLORS.primary} />
                <Text style={[styles.statText, { color: colors.text }]}>{challenge.repeats}</Text>
              </View>
             
              <View style={[styles.statItem,user?._id === challenge.creator?._id ?'':{display:'none'}, { 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <MaterialCommunityIcons name="update" size={28} color="#22c55e" />
                  </TouchableOpacity>
                  <ChallengeCreation visible={isModalVisible} onClose={() => setIsModalVisible(false)} challenge={challenge} />
                </View>
                <View style={[styles.statItem,user?._id === challenge.creator?._id ?'':{display:'none'},{ 
                backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' 
              }]}>
                  <TouchableOpacity onPress={() => handelDeleteChallenge()}>
                    <MaterialCommunityIcons name="archive-remove" size={28} color="red" />
                  </TouchableOpacity>
                </View>
            </View>
            <View >
          
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
              { challenge.creator?._id === user?._id &&(
                  <TouchableOpacity 
                  style={styles.addParticipantsButton}
                  onPress={()=>setIsUserSelector(true)}
                  >
                  <AntDesign name="addusergroup" size={28} color={colors.text} />
                  <UsersSelector 
                    visible={isUserSelector} 
                    onClose={() => setIsUserSelector(false)} 
                    onSelectParticipants={(participants) => handelAddParticipants(participants)} 
                  />
                  </TouchableOpacity>
                 
              )}
             
              <AntDesign name="Trophy" size={28} color="#FFD700" />
            </View>

            {challenge.participants && challenge.participants.length > 0 ? (
              <FlatList
                data={[...challenge.participants].filter((p): p is { userId: string; progress: number; userDetails: any } => !!p.userDetails).sort((a, b) => b.progress - a.progress)}
                renderItem={({ item, index }) => <RenderParticipant item={item} index={index} />}
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

          {isParticipant && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#fff",
                  borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressText, { color: colors.text }]}>{userProgress}% Complete</Text>
                  <Text style={[styles.progressText, { color: colorScheme === "dark" ? "#ccc" : "#777" }]}>
                    {Math.round(challenge.repeats * (userProgress / 100))}/{challenge.repeats} completed
                  </Text>
                </View>

                <View
                  style={[
                    styles.progressBarBackground,
                    {
                      backgroundColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                      height: 12,
                      marginVertical: 10,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${userProgress}%`,
                        backgroundColor: userProgress > 75 ? "#4CAF50" : userProgress > 40 ? "#FFC107" : COLORS.primary,
                        height: "100%",
                      },
                    ]}
                  />
                </View>

                <TouchableOpacity
                      style={[
                        styles.markCompletedButton,
                        progress?.isDone ? styles.markCompletedButtonDisabled : null,
                      ]}
                      onPress={handleMarkAsCompleted}
                      disabled={progress?.isDone}
                    >
                      {userProgress === 100 ? (
                        <>
                          <Text style={styles.markCompletedButtonText}>You completed the challenge</Text>
                        </>
                      ) : progress?.isDone ? (
                        <>
                          <MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
                          <Text style={styles.markCompletedButtonText}>Completed Today</Text>
                        </>
                      ) : (
                        <>
                          <Feather name="check-circle" size={24} color="#fff" />
                          <Text style={styles.markCompletedButtonText}>
                            Mark {challenge.frequency === "daily" ? "Today" : "This Week"} as Completed
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>


                <View style={styles.progressTips}>
                  <MaterialIcons name="lightbulb-outline" size={20} color={COLORS.primary} />
                  <Text style={[styles.progressTipsText, { color: colorScheme === "dark" ? "#ccc" : "#777" }]}>
                    {progress?.isDone
                      ? `Great job! Come back ${challenge.frequency === "daily" ? "tomorrow" : "next week"} to continue your progress.`
                      : `Complete your ${challenge.frequency} task to increase your progress.`}
                  </Text>
                </View>
              </View>
            </View>
          )}

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
    marginRight: 10,
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
    marginTop: 20,
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
  progressSection: {
    marginTop: 20,
  },
  progressTips: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  markCompletedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  progressTipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  markCompletedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  markCompletedButtonDisabled: {
    backgroundColor: "#ccc",
  },
  userChallengesButton: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addParticipantsButton: {

    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ChallengeDetails
