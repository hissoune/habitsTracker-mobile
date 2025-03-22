"use client"

import {  Octicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useEffect, useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from "react-native"
import { useFocusEffect } from "expo-router"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import {  getAllHabitsAction } from "../(redux)/hapitSlice"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"

import { COLORS } from "@/constants/Colors"
import { Habit } from "@/constants/types"
import HabitCreationModal from "@/components/habitCreation"
import HabitCard from "@/components/habitCard"
import FilterButtons from "@/components/filterButtons"

export default function HabitsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const dispatch = useAppDispatch()
  const { habits, isLoading } = useSelector((state: RootState) => state.habit)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [filtredHabits,setFiltredHabits] = useState<Habit[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  useFocusEffect(
    useCallback(() => {
      dispatch(getAllHabitsAction())

      
    }, [dispatch]),
  )

  useEffect(()=>{
    if (habits && activeFilter == "all") {
      setFiltredHabits(habits);
    }else {
      setFiltredHabits(habits.filter((habit)=> habit.status == activeFilter));

    }
  },[habits,activeFilter])
 
  const handelsearch = (query: string) => {
    setSearchQuery(query); 
    if (query === "") {
      setFiltredHabits(habits); 
    } else {
      const filtered = habits.filter((habit) =>
        habit.title.toLowerCase().includes(query.toLowerCase())
      );
      setFiltredHabits(filtered);
    }
  };
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
            value={searchQuery}
            onChangeText={handelsearch}
          />
          <TouchableOpacity style={styles.addButton}  onPress={() => setIsModalVisible(true)}>
            <Octicons name="diff-added" size={24} color="#fff" />
          </TouchableOpacity>
          <HabitCreationModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}/>
        </View>

        <FilterButtons setActiveFilter={setActiveFilter} activeFilter={activeFilter} />

        {filtredHabits.map((habit) => (
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
})