"use client";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  FlatList,
  ScrollView,
  Animated,
  ImageBackground,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useEffect, useRef } from "react";
import { COLORS } from "@/constants/Colors";

const habits = [
  { id: 1, name: "Morning Workout", progress: 0.8, streak: 12, icon: "weight-lifter" },
  { id: 2, name: "Meditation", progress: 0.6, streak: 5, icon: "meditation" },
  { id: 3, name: "Read 30min", progress: 0.4, streak: 3, icon: "book-open-page-variant" },
];

const challenges = [
  {
    id: 1,
    title: "30-Day Fitness Challenge",
    description: "Commit to daily workouts for a healthier lifestyle.",
    creator: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    participants: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
    likes: 150,
    dislikes: 12,
    favorites: 85,
    joined: true,
  },
  {
    id: 2,
    title: "7-Day No Sugar Challenge",
    description: "Avoid all added sugars for a week and reset your cravings.",
    creator: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    participants: [{ name: "David" }, { name: "Emma" }],
    likes: 98,
    dislikes: 5,
    favorites: 60,
    joined: false,
  },
  {
    id: 4,
    title: "30-Day Meditation Challenge",
    description: "Practice mindfulness every day for mental clarity and peace.",
    creator: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    participants: [
      { name: "Olivia" },
      { name: "Liam" },
      { name: "Sophia" },
      { name: "Mason" },
    ],
    likes: 200,
    dislikes: 20,
    favorites: 100,
    joined: true,
  },
  {
    id: 5,
    title: "10-Day Hydration Challenge",
    description: "Drink at least 8 glasses of water daily for better health.",
    creator: {
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    participants: [{ name: "Noah" }, { name: "Ava" }, { name: "Ethan" }],
    likes: 120,
    dislikes: 8,
    favorites: 70,
    joined: false,
  },
];



const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ progress, size = 70 }: { progress: number; size: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "#333" : "#e0e0e0"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ position: "absolute", fontSize: 12, fontWeight: "bold", color: isDark ? "#fff" : "#000" }}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const stats = useMemo(() => ({ streak: 15, completed: 45, ongoing: 3 }), []);

  const renderHabit = ({ item }: { item: any }) => (
    <View style={[styles.habitCard, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}>
      <View style={styles.habitHeader}>
        <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.primary} />
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, { color: isDark ? "#fff" : "#000" }]}>{item.name}</Text>
          <Text style={[styles.streakText, { color: isDark ? "#aaa" : "#666" }]}>{item.streak} day streak 🔥</Text>
        </View>
        <CircularProgress progress={item.progress} size={50} />
      </View>
    </View>
  );
  const renderChallenge = ({ item }:{ item:any }) => (
    <View style={[styles.card,{ backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}>
      <View style={styles.chalengeHeader}>
         <Image source={{ uri: item.creator.avatar }} style={styles.avatar} />
        <TouchableOpacity
            style={[
              styles.joinButton,
            
            ]}
            activeOpacity={0.8}
          >
<AntDesign name="deleteusergroup" size={24} color="#fff" />   
    </TouchableOpacity>

      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.creator}>By: {item.creator.name}</Text>
      <Text style={styles.participants}>
        Participants:{" "}
        {item.participants.length > 0
          ? `${item.participants[item.participants.length - 1].name} + ${
              item.participants.length - 1
            }`
          : "No participants yet"}
      </Text>
      <Text style={styles.stats}>
        👍 {item.likes} | 👎 {item.dislikes} | ⭐ {item.favorites}
      </Text>
  

    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#000" : "#f5f5f5" }]}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{ uri: "https://i.pinimg.com/736x/da/44/34/da4434b3365332fcfb13be7325553cf7.jpg" }}
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient colors={["transparent", COLORS.secondary]} style={styles.header}>
              <View style={styles.statsContainer}>
                {Object.entries(stats).map(([key, value]) => (
                  <View key={key} style={styles.statItem}>
                    <Text style={styles.statNumber}>{value}</Text>
                    <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Today's Habits</Text>
          <FlatList
            data={habits}
            renderItem={renderHabit}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Today's Chalenges</Text>
          <FlatList
            data={challenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { height: 400, overflow: "hidden" },
  headerImage: { width: "100%", height: "100%" },
  headerImageStyle: { borderBottomLeftRadius: 74, borderBottomRightRadius: 24 },
  header: { flex: 1, justifyContent: "flex-end", paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20 },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  statLabel: { color: "#ffffff80", fontSize: 14, marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  habitCard: { borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", elevation: 3 },
  habitHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  habitInfo: { flex: 1 },
  habitName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  streakText: { fontSize: 14 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    color:'#fff',

  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  creator: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  participants: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color:`${COLORS.primary}`,

  },
  stats: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, 
    width:50
  },
  
  joinButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
  chalengeHeader:{
    flexDirection:"row",
    justifyContent:'space-between'
  }
  
});
