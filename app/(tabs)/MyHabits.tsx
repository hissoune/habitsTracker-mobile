"use client"

import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  useColorScheme,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getAllHabitsAction } from "../(redux)/hapitSlice"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import Svg, { Circle } from "react-native-svg"
import { COLORS } from "@/constants/Colors"
import { Habit } from "@/constants/types"

const getStatusBgColor = (status: string, isDark: boolean) => {
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

export const CircularProgress = ({ progress, size = 70, habitStatus }:{progress:number,size:number,habitStatus:any}) => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const AnimatedCircle = Animated.createAnimatedComponent(Circle)

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [progress, animatedValue]) // Added animatedValue to dependencies

  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  })

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "#333" : "#e5e7eb"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStatusColor(habitStatus)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset as unknown as number}
          strokeLinecap="round"
        />
      </Svg>
      <Text
        style={{
          position: "absolute",
          fontSize: size / 4,
          fontWeight: "bold",
          color: isDark ? "#fff" : "#1f2937",
        }}
      >
        {Math.round(progress * 100)}%
      </Text>
    </View>
  )
}

const HabitCard = ({ habit }:{habit:Habit}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const router = useRouter()

  const habitDetails = async (habitId: string) => {
    router.push(`/details/habitDetails?habitId=${habitId}`)
  }

  return (
    <TouchableOpacity
      onPress={() => habit._id && habitDetails(habit._id)}
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight, { borderColor: getStatusColor(habit.status) }]}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isDark && styles.titleDark]}>{habit.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(habit.status, isDark) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(habit.status) }]}>{habit.status}</Text>
            </View>
          </View>
          <View style={[styles.frequencyContainer, isDark && styles.frequencyContainerDark]}>
            <MaterialIcons name="event-repeat" size={20} color={COLORS.primary} />
            <Text style={[styles.frequency, isDark && styles.frequencyDark]}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </Text>
          </View>
        </View>
        <CircularProgress progress={habit.progress ?? 0} size={70} habitStatus={habit.status} />
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBadge, isDark && styles.statBadgeDark]}>
          <Ionicons name="repeat" size={16} color={COLORS.primary} />
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>{habit.repeats}</Text>
        </View>

        <View style={styles.statsRight}>
          <View style={[styles.statBadge, isDark && styles.statBadgeDark]}>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>{habit.sucsess}</Text>
            <Entypo name="check" size={16} color="#22c55e" />
          </View>
          <View style={[styles.statBadge, isDark && styles.statBadgeDark]}>
            <Text style={[styles.statValue, isDark && styles.statValueDark]}>{habit.fails}</Text>
            <FontAwesome5 name="times" size={16} color="#ef4444" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const FilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState("active")
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  const filters = [
    {
      label: "Failed",
      value: "failed",
      icon: <MaterialIcons name="error" size={20} color={getStatusColor("failed")} />,
    },
    {
      label: "Active",
      value: "active",
      icon: <FontAwesome name="play-circle" size={20} color={getStatusColor("active")} />,
    },
    {
      label: "Completed",
      value: "completed",
      icon: <MaterialIcons name="check-circle" size={20} color={getStatusColor("completed")} />,
    },
  ]

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          style={[
            styles.filterButton,
            isDark && styles.filterButtonDark,
            activeFilter === filter.value && styles.activeButton,
          ]}
          onPress={() => setActiveFilter(filter.value)}
        >
          {filter.icon}
          <Text
            style={[
              styles.filterText,
              isDark && styles.filterTextDark,
              activeFilter === filter.value && styles.activeText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default function HabitsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const dispatch = useAppDispatch()
  const { habits, isLoading } = useSelector((state: RootState) => state.habit)

  useFocusEffect(
    useCallback(() => {
      dispatch(getAllHabitsAction())
    }, [dispatch]),
  )

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, isDark && styles.loaderContainerDark]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <ImageBackground
          source={{ uri: "https://i.pinimg.com/736x/bd/19/69/bd1969c36548f390232635d850c67686.jpg" }}
          style={styles.headerImage}
          imageStyle={styles.headerImageStyle}
        >
          <LinearGradient colors={isDark ? ["transparent", "#000"] : ["transparent", "#fff"]} style={styles.overlay} />
        </ImageBackground>
      </View>

      <LinearGradient
        colors={isDark ? [`${COLORS.primary}30`, "#000"] : [`${COLORS.primary}20`, "#fff"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>My Habits</Text>
          <View style={[styles.streakBadge, isDark && styles.streakBadgeDark]}>
            <Text style={styles.streakText}>🔥 12 Day Streak!</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchBar, isDark && styles.searchBarDark]}
            placeholder="Search habits..."
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          />
          <TouchableOpacity style={styles.addButton}>
            <Octicons name="diff-added" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FilterButtons />

        {habits.map((habit) => (
          <HabitCard key={habit._id} habit={habit} />
        ))}
      </LinearGradient>
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
  containerLight: {
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderContainerDark: {
    backgroundColor: "#000",
  },
  headerContainer: {
    height: 200,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerImageStyle: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
  },
  headerGradient: {
    padding: 16,
    marginTop: -50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerTitleDark: {
    color: "#fff",
  },
  streakBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  streakBadgeDark: {
    backgroundColor: "#1a1a1a",
  },
  streakText: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    color: "#1f2937",
  },
  searchBarDark: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterButtonDark: {
    backgroundColor: "#1a1a1a",
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: "#6b7280",
    fontWeight: "600",
  },
  filterTextDark: {
    color: "#9ca3af",
  },
  activeText: {
    color: "#fff",
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#1a1a1a",
  },
  cardLight: {
    backgroundColor: "#fff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
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
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    alignSelf: "flex-start",
  },
  frequencyContainerDark: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  frequency: {
    fontSize: 14,
    color: "#1f2937",
  },
  frequencyDark: {
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsRight: {
    flexDirection: "row",
    gap: 8,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statBadgeDark: {
    backgroundColor: "#333",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  statValueDark: {
    color: "#fff",
  },
})

