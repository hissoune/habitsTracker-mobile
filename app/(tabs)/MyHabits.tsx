"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, useColorScheme, TextInput, ImageBackground } from "react-native"
import { COLORS } from "."

// Sample data based on the provided schema
const habits = [
  {
    _id: "1",
    userId: "user1",
    title: "Drink 2L of water",
    description: "Stay hydrated throughout the day",
    frequency: "daily",
    reminderTime: new Date("2024-02-21T09:00:00"),
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-21"),
    progress: 0.7, // Added for visualization
    streak: 5,
  },
  {
    _id: "2",
    userId: "user1",
    title: "Morning Meditation",
    description: "15 minutes of mindfulness",
    frequency: "daily",
    reminderTime: new Date("2024-02-21T07:00:00"),
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-21"),
    progress: 0.9,
    streak: 12,
  },
  {
    _id: "3",
    userId: "user1",
    title: "Weekly Exercise",
    description: "3 times per week",
    frequency: "weekly",
    reminderTime: new Date("2024-02-21T18:00:00"),
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-21"),
    progress: 0.3,
    streak: 2,
  },
]

const CircularProgress = ({ progress, size = 70 }:{progress:any,size:number}) => {
  const animatedValue = new Animated.Value(0)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [progress, animatedValue])

  const rotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    },
   
  )

  return (
    <View style={[styles.progressContainer, { width: size, height: size }]}>
      <View style={[styles.progressBackground, { borderColor: isDark ? "#333" : "#e0e0e0" }]} />
      <Animated.View
        style={[
          styles.progressForeground,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotateZ: rotation }],
            borderColor: getProgressColor(progress),
          },
        ]}
      />
      <Text style={[styles.progressText, { color: isDark ? "#fff" : "#000" }]}>{Math.round(progress * 100)}%</Text>
    </View>
  )
}

const HabitCard = ({ habit }:{habit:any}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{habit.title}</Text>
          <Text style={[styles.frequency, { color: isDark ? "#aaa" : "#666" }]}>
            {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
          </Text>
        </View>
        <CircularProgress progress={habit.progress} size={70} />
      </View>

      <Text style={[styles.description, { color: isDark ? "#bbb" : "#666" }]}>{habit.description}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDark ? "#fff" : "#000" }]}>🔥 {habit.streak}</Text>
          <Text style={[styles.statLabel, { color: isDark ? "#aaa" : "#666" }]}>Day Streak</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: isDark ? "#fff" : "#000" }]}>
            ⏰ {habit.reminderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          <Text style={[styles.statLabel, { color: isDark ? "#aaa" : "#666" }]}>Reminder</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function HabitsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#000" : "#f5f5f5" }]}>
       <View style={styles.headerContainer}>
                <ImageBackground
                  source={{ uri: "https://i.pinimg.com/736x/bd/19/69/bd1969c36548f390232635d850c67686.jpg" }}
                  style={styles.headerImage}
                  imageStyle={styles.headerImageStyle}
                >
                  <LinearGradient colors={["transparent", COLORS.secondary]} style={styles.OverLay}>
                    <View style={styles.statsContainer}>
                     
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? "#fff" : "#000" }]}>My Habits</Text>

        <View style={[styles.streakBadge, { backgroundColor: isDark ? "#333" : "#fff" }]}>
          <Text style={styles.streakText}>🔥 12 Day Streak!</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
  
  <TextInput
    style={styles.searchBar} 
    placeholder="Search movies and series" 
    placeholderTextColor="#999" 
    // onChangeText={(text) => handelSearch(text)}
  />     
   </View>
<View style={styles.filterContainer}>
  <TouchableOpacity style={styles.filterButton} ><Text style={styles.filterText}>Failed</Text></TouchableOpacity>
  <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText} >Active</Text></TouchableOpacity>
  <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText} >Compleeted</Text></TouchableOpacity>
</View>
      {habits.map((habit) => (
        <HabitCard key={habit._id} habit={habit} />
      ))}
    </ScrollView>
  )
}

const getProgressColor = (progress:any) => {
  if (progress < 0.4) return "#ff4444"
  if (progress < 0.7) return "#ffbb33"
  return "#00C851"
}

const styles = StyleSheet.create({
  container: {
    paddingVertical:20,
    flex: 1,
  },
  headerContainer: { height: 200, overflow: "hidden" },
  headerImage: { width: "100%", height: "100%" },
  headerImageStyle: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  OverLay: {
    padding: 16,
    height:200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  streakText: {
    color: "#ff9500",
    fontWeight: "600",
  },
  card: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#e0e0e0",
  },
  progressForeground: {
    position: "absolute",
    borderWidth: 5,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#fff",
  },
  filterButton: {
    padding: 7,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

