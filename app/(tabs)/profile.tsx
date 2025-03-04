import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image, useColorScheme, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { LinearGradient } from "expo-linear-gradient"
import { BarChart } from "react-native-chart-kit"
import { COLORS } from "@/constants/Colors"
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useRouter } from "expo-router"
import { logoutAction } from "../(redux)/aithSlice"

const mockHabits = [
  { id: 1, name: "Morning Meditation", streak: 15, totalCompletions: 45, failures: 5 },
  { id: 2, name: "Daily Exercise", streak: 7, totalCompletions: 30, failures: 10 },
  { id: 3, name: "Reading", streak: 3, totalCompletions: 20, failures: 8 },
]

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const isDark = useColorScheme() === "dark"
  const dispatch = useAppDispatch()
 const router = useRouter()
 const handelLogout = async ()=>{
    await dispatch(logoutAction())
    router.push('../')
 }
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={"#6C63FF"} size={"large"} />
      </View>
    )
  }


  const mostPracticedHabit = [...mockHabits].sort((a, b) => b.totalCompletions - a.totalCompletions)[0]

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [5, 7, 6, 8, 4, 6, 7],
        color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
      },
    ],
  }

  const screenWidth = Dimensions.get("window").width - 40

  return (
    <LinearGradient colors={isDark ? [`${COLORS.primary}30`, "#000"] : [`${COLORS.primary}20`, "#fff"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.image || "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
            <View style={styles.EditLogoutContainer}>
            <TouchableOpacity><MaterialCommunityIcons name="logout" size={28} color="#fff" onPress={()=>handelLogout() } /></TouchableOpacity>
            <TouchableOpacity><AntDesign name="edit" size={28} color="#fff" /></TouchableOpacity>
            </View>
            
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {mockHabits.reduce((acc, habit) => acc + habit.totalCompletions, 0)}
                </Text>
                <Text style={styles.statLabel}>Completions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.max(...mockHabits.map((habit) => habit.streak))}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Practiced Habit</Text>
          <View style={styles.habitCard}>
            <View style={styles.habitHeader}>
              <Text style={styles.habitName}>{mostPracticedHabit.name}</Text>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{mostPracticedHabit.streak} day streak</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(mostPracticedHabit.totalCompletions / (mostPracticedHabit.totalCompletions + mostPracticedHabit.failures)) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.successText}>{mostPracticedHabit.totalCompletions} successes</Text>
                <Text style={styles.failureText}>{mostPracticedHabit.failures} failures</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Performance</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={screenWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: "#0F3460",
                backgroundGradientTo: "#1A1A2E",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7,
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habits Summary</Text>
          {mockHabits.map((habit) => (
            <View key={habit.id} style={styles.habitSummaryCard}>
              <View style={styles.habitSummaryHeader}>
                <Text style={styles.habitSummaryName}>{habit.name}</Text>
                <Text style={styles.habitSummaryStreak}>{habit.streak} days</Text>
              </View>
              <View style={styles.habitSummaryStats}>
                <View style={styles.habitSummaryStatItem}>
                  <View style={[styles.dot, styles.successDot]} />
                  <Text style={styles.habitSummaryStatText}>{habit.totalCompletions} successes</Text>
                </View>
                <View style={styles.habitSummaryStatItem}>
                  <View style={[styles.dot, styles.failureDot]} />
                  <Text style={styles.habitSummaryStatText}>{habit.failures} failures</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  EditLogoutContainer:{
    flexDirection: "row",
    justifyContent:"space-between",
    marginTop:20,
    padding:5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  profileImageContainer: {
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#6C63FF",
  },
  profileInfo: {
    marginTop:20,
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#B8B8D1",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(108, 99, 255, 0.1)",
    borderRadius: 12,
    padding: 10,
    
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#B8B8D1",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  habitCard: {
    backgroundColor: "rgba(15, 52, 96, 0.6)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  streakBadge: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  successText: {
    color: "#6C63FF",
    fontSize: 14,
  },
  failureText: {
    color: "#E94560",
    fontSize: 14,
  },
  chartContainer: {
    alignItems: "center",
    backgroundColor: "rgba(15, 52, 96, 0.6)",
    borderRadius: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  habitSummaryCard: {
    backgroundColor: "rgba(15, 52, 96, 0.6)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  habitSummaryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  habitSummaryStreak: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "bold",
  },
  habitSummaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  habitSummaryStatItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  successDot: {
    backgroundColor: "#6C63FF",
  },
  failureDot: {
    backgroundColor: "#E94560",
  },
  habitSummaryStatText: {
    fontSize: 13,
    color: "#B8B8D1",
  },
})

export default Profile

