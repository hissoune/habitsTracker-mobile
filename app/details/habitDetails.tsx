"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
import { MaterialIcons, Ionicons, Entypo, FontAwesome5, Feather } from "@expo/vector-icons"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { COLORS } from "@/constants/Colors"
import { LineChart } from "react-native-chart-kit"
import { LinearGradient } from "expo-linear-gradient"
import { CircularProgress } from "../(tabs)/MyHabits"
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import {
  completProgressAction,
  getHabitByIdAction,
  getProgressAction,
  reactiveHabitAction,
} from "../(redux)/hapitSlice"

const { width } = Dimensions.get("window")

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: any; color: string }) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <View style={[styles.statCard, isDark && styles.statCardDark]}>
      <LinearGradient
        colors={isDark ? [`${color}20`, `05`] : [`${color}15`, `${color}05`]}
        style={styles.statGradient}
      >
        <View style={[styles.iconContainer, { backgroundColor: isDark ? `${color}30` : `${color}20` }]}>{icon}</View>
        <Text style={[styles.statValue, { color: isDark ? "#fff" : "#1f2937" }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: isDark ? "#9ca3af" : "#6b7280" }]}>{title}</Text>
      </LinearGradient>
    </View>
  )
}

const HabitDetails = () => {
  const { habitId } = useLocalSearchParams()
  const { habits, isLoading, progress } = useSelector((state: RootState) => state.habit)
  const [habit, setHabit] = useState(habits.find((h) => h._id === habitId))

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const dispatch = useAppDispatch()
  const isMounted = useRef(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const router = useRouter()

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(()=> {
    const currentHabit = habits.find((h) => h._id === habitId);
    if(currentHabit)
      setHabit({...currentHabit})
  },[habits])

  useFocusEffect(
    useCallback(() => {
      const fetchHabitDetails = async () => {
        if (!habitId || typeof habitId !== "string") {
          router.back();
          return;
        }

        if (isInitialLoad && isMounted.current) {
          try {
            dispatch(await getHabitByIdAction(habitId))
            setIsInitialLoad(false);
          } catch (error) {
            console.error("Failed to fetch habit:", error);
            router.back();
          }
        }
      };

      fetchHabitDetails();

      return () => {
        isMounted.current = false; 
      };
    }, [dispatch, isInitialLoad, router, habit])
  );

  useEffect(() => {
    const fetchProgress = async () => {
      if (!habit?._id || !isMounted.current) return

      try {
        await dispatch(getProgressAction(habit._id))
      } catch (error) {
        console.error("Failed to fetch progress:", error)
      }
    }

    fetchProgress()
  }, [habit?._id, dispatch])

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

  const repeatsArray = Array.from({ length: habit.repeats }, (_, i) => i + 1)

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [65, 80, 75, 90, 85, 95, 88],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  const getStatusBgColor = (status: string) => {
    if (isDark) {
      switch (status.toLowerCase()) {
        case "active":
          return "rgba(99, 102, 241, 0.2)"
        case "completed":
          return "rgba(34, 197, 94, 0.2)"
        case "failed":
          return "rgba(239, 68, 68, 0.2)"
        default:
          return "rgba(107, 114, 128, 0.2)"
      }
    }
    switch (status.toLowerCase()) {
      case "active":
        return "#e2e8ff"
      case "completed":
        return "#dcfce7"
      case "failed":
        return "#fee2e2"
      default:
        return "#f3f4f6"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#6366f1"
      case "completed":
        return "#22c55e"
      case "failed":
        return "#ef4444"
      default:
        return "#6b7280"
    }
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

  const getFrequencyText = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "daily":
        return "Day"
      case "weekly":
        return "Week"
      case "monthly":
        return "Month"
      default:
        return "Period"
    }
  }

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
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(habit.status) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(habit.status) }]}>{habit.status}</Text>
            </View>
          </View>

          <View style={styles.frequencyContainer}>
            <MaterialIcons name="event-repeat" size={20} color={COLORS.primary} />
            <Text style={[styles.frequency, isDark && styles.frequencyDark]}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Current Progress</Text>
          <View style={styles.progressContent}>
            <CircularProgress progress={habit.progress || 0} size={80} habitStatus={habit.status} />
            <View style={styles.progressInfo}>
              <Text style={[styles.progressPercentage, isDark && styles.progressPercentageDark]}>
                {Math.round((habit.progress || 0) * 100)}% Complete
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
          value={habit.sucsess}
          icon={<Entypo name="check" size={24} color="#22c55e" />}
          color="#22c55e"
        />
        <StatCard
          title="Failed"
          value={habit.fails}
          icon={<FontAwesome5 name="times" size={24} color="#ef4444" />}
          color="#ef4444"
        />
      </View>

      <View style={[styles.chartSection, isDark && styles.chartSectionDark]}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{habit.frequency} Progress</Text>
        <LineChart
          data={chartData}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: isDark ? "#000" : "#fff",
            backgroundGradientFrom: isDark ? "#000" : "#fff",
            backgroundGradientTo: isDark ? "#000" : "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: () => (isDark ? "#fff" : "#1f2937"),
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: COLORS.primary,
            },
          }}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
        />
      </View>

      <View style={[styles.streakSection, isDark && styles.streakSectionDark]}>
        <View style={styles.streakHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Current Streak</Text>
          <View style={[styles.streakBadge, isDark && styles.streakBadgeDark]}>
            <Feather name="zap" size={20} color="#f59e0b" />
            <Text style={styles.streakText}>{progress?.streak || habit.sucsess} Days</Text>
          </View>
        </View>
        <View style={styles.streakDays}>
          {repeatsArray.map((day) => (
            <View
              key={day}
              style={[
                styles.dayDot,
                {
                  backgroundColor:
                  progress?  (progress?.streak && day <= progress.streak ? COLORS.primary:isDark?"#333":'#f59e0b') : habit.sucsess ? COLORS.primary  : "#333",
                },
              ]}
            />
          ))}
        </View>
      </View>

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
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statCardDark: {
    backgroundColor: "#1a1a1a",
  },
  statGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statTitle: {
    fontSize: 12,
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
  chartSection: {
    padding: 16,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartSectionDark: {
    backgroundColor: "#1a1a1a",
    
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  streakSection: {
    padding: 16,
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  streakSectionDark: {
    backgroundColor: "#1a1a1a",
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakBadgeDark: {
    backgroundColor: "#78350f",
  },
  streakText: {
    marginLeft: 4,
    color: "#f59e0b",
    fontWeight: "600",
  },
  streakDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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

