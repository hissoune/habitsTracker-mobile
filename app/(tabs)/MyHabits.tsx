"use client"

import { Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, useColorScheme, TextInput, ImageBackground, ActivityIndicator } from "react-native"

import { useFocusEffect, useRouter } from "expo-router"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getAllHabitsAction, getHabitByIdAction } from "../(redux)/hapitSlice"
import { useSelector } from "react-redux"
import { RootState } from '../(redux)/store';
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "@/constants/Colors"


const getStatusBgColor = (status: string) => {
  switch (status) {
    case "completed":
      return "rgba(34, 197, 94, 0.1)" 
    case "failed":
      return "rgba(239, 68, 68, 0.2)" 
    default:
      return "rgba(59, 130, 246, 0.1)"
  }
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#22c55e" 
    case "failed":
      return "#ef4444" 
    default:
      return "#3b82f6"
  }
}

export const CircularProgress = ({ progress, size = 70 ,habitStatus}:{progress:any,size:number,habitStatus:any}) => {
const animatedValue = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
          stroke={getStatusColor(habitStatus)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset as unknown as number}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ position: "absolute", fontSize: 12, fontWeight: "bold", color: isDark ? "#fff" : "#000" }}>
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}

const HabitCard = ({ habit }:{habit:any}) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const router = useRouter();
  const dispatch = useAppDispatch();

const habitDetals = async (habitId:string)=>{
  dispatch(getHabitByIdAction(habitId));
 router.push('/details/habitDetails')
}
 

  return (
    <TouchableOpacity onPress={()=>habitDetals(habit._id)} style={[styles.card,{borderColor:getStatusColor(habit.status)}]} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{habit.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(habit.status) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(habit.status) }]}>{habit.status}</Text>
            </View>
          </View>
          <View style={styles.frequencyContainer}>
             <MaterialIcons name="event-repeat" size={24} color={COLORS.primary} />
          <Text style={styles.frequency}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
          </View>
         
        </View>
        <CircularProgress progress={habit.progress} size={70} habitStatus={habit.status} />
      </View>


      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statBadge}>
            <Ionicons name="repeat" size={16} color={COLORS.primary} />
            <Text style={styles.statValue}>{habit.repeats}</Text>
          </View>
        </View>

        <View style={styles.statsRight}>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{habit.sucsess}</Text>
            <Entypo name="check" size={16} color={COLORS.primary} />
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{habit.fails}</Text>
            <FontAwesome5 name="times" size={16} color="#ef4444" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}


const FilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState('active');

  const filters = [
    { label: 'Failed', value: 'failed' ,icon: <MaterialIcons name="error" size={20} color={getStatusColor('failed')} />},
    { label: 'Active', value: 'active', icon: <FontAwesome name="play-circle" size={20} color={getStatusColor('active')} /> },
    { label: 'Completed', value: 'completed',icon: <MaterialIcons name="check-circle" size={20} color={getStatusColor('completed')} />  },
  ];

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          style={[
            styles.filterButton,
            activeFilter === filter.value && styles.activeButton,
          ]}
          onPress={() => setActiveFilter(filter.value)}
        >
            
           {filter.icon}
          <Text
            style={[
              styles.filterText,
              activeFilter === filter.value && styles.activeText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function HabitsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const dispatch = useAppDispatch();
  const {habits,isLoading} = useSelector((state:RootState)=>state.habit)
  useFocusEffect(
    useCallback(() => {
      dispatch(getAllHabitsAction());
    }, [dispatch])
  );

  if (isLoading) {
     return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        );
  }
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
   <TouchableOpacity style={[styles.newHabitButton, ]}>
            
    <Text style={[ styles.filterText, ]}>
    <Octicons name="diff-added" size={24} color="#fff" />
    </Text>
  </TouchableOpacity>
   </View>
<View >
<FilterButtons />
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
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },

  container: {
    paddingVertical:20,
    flex: 1,
  },
  successAndFails:{
    padding:6,
    flexDirection: "row",
    gap:6,
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:10,
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',

  },
  newHabitButton:{
  backgroundColor:"#4ECDC4",
  marginHorizontal:5,
  padding:5,
  height:40,
  width:40,
  borderRadius:10,
 alignItems: "center",
  justifyContent:"center",
  alignContent:'center',


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
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth:1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: "#1a1a1a",
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
    color:'#fff'
  },
 
  statItem: {
    alignItems: "center",
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
  
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
 
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  frequency: {
    fontSize: 14,
    color: "#fff",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frequencyContainer: {
    borderColor:"#666",
    borderWidth:1,
    borderRadius:10,
    marginVertical:4,
    padding:4,
    flexDirection: "row",
    gap:10,
    alignItems: "center",
    width:100
  },
  statsRight: {
    flexDirection: "row",
    gap: 8,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#666",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  filterButton: {
    padding:8,
    borderRadius: 20,
    borderWidth:1,
    borderColor:'#E0E0E0',
    elevation: 2, 
    flexDirection: "row",
    gap:5,
    boxShadow: '0 0 10px rgba(200, 200, 200, 0.8)',

  },
  activeButton: {
    backgroundColor: '#4ECDC4', 

  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#FFF', 
  },
})

