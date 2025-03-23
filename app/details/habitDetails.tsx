"use client"

import {  useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  useColorScheme,
} from "react-native"
import { MaterialIcons, Ionicons, Entypo, FontAwesome5, Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { COLORS } from "@/constants/Colors"
import { LineChart } from "react-native-chart-kit"
import { LinearGradient } from "expo-linear-gradient"
import {  router, useLocalSearchParams } from "expo-router"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import {
  completProgressAction,
  deleteHabitAction,
  getProgressAction,
  reactiveHabitAction,
} from "../(redux)/hapitSlice"
import { CircularProgress } from "../../components/CircularProgress"
import { getFrequencyText, getStatusBgColor, getStatusColor } from "../helpers/habitHelper"
import StatCard from "@/components/StatCard"
import RepeatsArray from '../../components/repeatsArray';
import HabitCreationModal from "@/components/habitCreation"




const HabitDetails = () => {
  const { habitId } = useLocalSearchParams()
  const { habits, isLoading, progress } = useSelector((state: RootState) => state.habit)

  const [habit, setHabit] = useState(habits.find((h) => h._id === habitId))
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const dispatch = useAppDispatch()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(()=> {
    const currentHabit = habits.find((h) => h._id === habitId);
    if(currentHabit)
      setHabit({...currentHabit})
  },[habits])

 

  useEffect(() => {
    const fetchProgress = async () => {
      if (!habit?._id ) return
        await dispatch(getProgressAction(habit._id))
    }

    fetchProgress()
  }, [habit?._id, dispatch,habits])

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>Loading habit details...</Text>
      </View>
    )
  }

  if (!habit) {
    return (
      <View style={[styles.errorContainer, isDark && styles.errorContainerDark]}>
        <MaterialIcons name="error-outline" size={48} color={COLORS.primary} />
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>Failed to load habit details</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setIsInitialLoad(true)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  

  

  const handleReactiveHabit = async () => {
    try {
      if (habit._id) {
        await dispatch(reactiveHabitAction(habit._id))
      }
    } catch (error) {
      console.error("Failed to reactive habit:", error)
    }
  }

  const handleCompleteProgress = async () => {
    try {
      if (progress?._id) {
        await dispatch(completProgressAction(progress._id))
      }
    } catch (error) {
      console.error("Failed to complete progress:", error)
    }
  }

  const handeldeleteHabit = async () => {
    try {
      if (habit._id) {
        await dispatch(deleteHabitAction(habit._id))
        router.push('/(tabs)/MyHabits')
      }
    } catch (error) {
      console.error("Failed to delete habit:", error) 
    }}



  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <LinearGradient
        colors={isDark ? [`${COLORS.primary}30`, "#000"] : [`${COLORS.primary}20`, "#fff"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, isDark && styles.titleDark]}>{habit.title}</Text>
           
            <View style={[styles.statusBadge, { backgroundColor: habit.status ? getStatusBgColor(habit.status,isDark) : "#f3f4f6" }]}>
              <Text style={[styles.statusText, { color: getStatusColor(habit.status || "unknown") }]}>{habit.status || "unknown"}</Text>
            </View>
          </View>

          <View style={styles.frequencyContainer}>
            <MaterialIcons name="event-repeat" size={20} color={COLORS.primary} />
            <Text style={[styles.frequency, isDark && styles.frequencyDark]}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </Text>
          </View>
          <View style={[styles.frequencyContainer , {padding:10,flexDirection:'row',justifyContent:'space-between'}]}>

          <View style={styles.frequencyContainer}>
            <TouchableOpacity onPress={()=>setIsModalVisible(true)}>
            <MaterialCommunityIcons name="update" size={28} color="#22c55e" />
            </TouchableOpacity>
            <HabitCreationModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} habit={habit}/>

          </View>
          <View style={styles.frequencyContainer}>
          <TouchableOpacity onPress={()=>{handeldeleteHabit()}}>
          <MaterialCommunityIcons name="archive-remove" size={28} color="red" />
          </TouchableOpacity>
          </View>
          </View>
          
        </View>

        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Current Progress</Text>
          <View style={styles.progressContent}>
            <CircularProgress progress={habit.progress || 0} size={80} habitStatus={habit.status} />
            <View style={styles.progressInfo}>
              <Text style={[styles.progressPercentage, isDark && styles.progressPercentageDark]}>
                {Math.round((habit.progress || 0))}% Complete
              </Text>
              <Text
                style={[
                  styles.progressSubtext,
                  isDark && styles.progressSubtextDark,
                  { color: habit.status === "failed" ? "#ef4444" : COLORS.primary },
                ]}
              >
                {habit.status === "failed"
                  ? "Don't give up! You can always try again"
                  : "Keep going, you're doing great!"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Repeats"
          value={habit.repeats}
          icon={<Ionicons name="repeat" size={24} color={COLORS.primary} />}
          color={COLORS.primary}
        />
        <StatCard
          title="Successful"
          value={habit.sucsess ?? 0}
          icon={<Entypo name="check" size={24} color="#22c55e" />}
          color="#22c55e"
        />
        <StatCard
          title="Failed"
          value={habit.fails ?? 0}
          icon={<FontAwesome5 name="times" size={24} color="#ef4444" />}
          color="#ef4444"
        />
      </View>

    <RepeatsArray habit={habit} progress={progress} isDark={isDark} />

      <TouchableOpacity
        style={[
          styles.actionButton,
          isDark && styles.actionButtonDark,
          (!progress || progress.status) && styles.actionButtonDisabled,
        ]}
        onPress={progress ?()=> handleCompleteProgress() :()=> handleReactiveHabit()}
         disabled={progress?.status}
        activeOpacity={0.7}
      >
        <Text style={styles.actionButtonText}>
          {progress
            ? progress.status
              ? `Completed for this ${getFrequencyText(habit.frequency)}!`
              : "Mark as Complete"
            :habit.status == 'failed'? "Try Again":habit.status == 'completed'?"Try Again":'starting soon'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 16,
  },
  loadingContainerDark: {
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 16,
  },
  loadingTextDark: {
    color: "#9ca3af",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 16,
    padding: 20,
  },
  errorContainerDark: {
    backgroundColor: "#000",
  },
  errorText: {
    color: "#1f2937",
    fontSize: 18,
    textAlign: "center",
  },
  errorTextDark: {
    color: "#fff",
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
    marginRight: 16,
  },
  titleDark: {
    color: "#fff",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  frequencyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  frequency: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  frequencyDark: {
    color: "#9ca3af",
  },
  progressSection: {
    marginTop: 20,
  },
  progressContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  progressPercentageDark: {
    color: "#fff",
  },
  progressSubtext: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressSubtextDark: {
    color: "#9ca3af",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 20,
    gap: 12,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: "#fff",
  },
 
  actionButton: {
    margin: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  actionButtonDark: {
    shadowOpacity: 0.5,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default HabitDetails

