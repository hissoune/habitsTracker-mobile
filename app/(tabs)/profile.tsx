import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image, useColorScheme, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { LinearGradient } from "expo-linear-gradient"
import { BarChart } from "react-native-chart-kit"
import { COLORS, Colors } from "@/constants/Colors"
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useRouter } from "expo-router"
import { logoutAction } from "../(redux)/aithSlice"
import  replaceIp  from "../helpers/replaceIp"

const mockHabits = [
  { id: 1, name: "Morning Meditation", streak: 15, totalCompletions: 45, failures: 5 },
  { id: 2, name: "Daily Exercise", streak: 7, totalCompletions: 30, failures: 10 },
  { id: 3, name: "Reading", streak: 3, totalCompletions: 20, failures: 8 },
]

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const colorScheme = useColorScheme() || "light"
  const colors = Colors[colorScheme]
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  const handelLogout = async () => {
    await dispatch(logoutAction())
    router.push('../')
  }
  
  if (!user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={COLORS.primary} size={"large"} />
      </View>
    )
  }

  const mostPracticedHabit = [...mockHabits].sort((a, b) => b.totalCompletions - a.totalCompletions)[0]

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [5, 7, 6, 8, 4, 6, 7],
        color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`, // COLORS.primary with opacity
      },
    ],
  }

  const screenWidth = Dimensions.get("window").width - 40

  return (
    <LinearGradient 
      colors={colorScheme === "dark" 
        ? [`${COLORS.primary}30`, colors.background] 
        : [`${COLORS.primary}20`, colors.background]
      } 
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: replaceIp(user.image || "", process.env.EXPO_PUBLIC_REPLACE || "") || "https://via.placeholder.com/150" }}
              style={[styles.profileImage, { borderColor: COLORS.primary }]}
            />
            <View style={styles.EditLogoutContainer}>
              <TouchableOpacity onPress={handelLogout}>
                <MaterialCommunityIcons name="logout" size={28} color={colors.tint} />
              </TouchableOpacity>
              <TouchableOpacity>
                <AntDesign name="edit" size={28} color={colors.tint} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: colors.icon }]}>{user.email}</Text>
            <View style={[styles.statsContainer, { backgroundColor: colorScheme === "dark" ? "rgba(78, 205, 196, 0.1)" : "rgba(10, 126, 164, 0.1)" }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockHabits.reduce((acc, habit) => acc + habit.totalCompletions, 0)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>Completions</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: `${colors.icon}40` }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{Math.max(...mockHabits.map((habit) => habit.streak))}</Text>
                <Text style={[styles.statLabel, { color: colors.icon }]}>Best Streak</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Practiced Habit</Text>
          <View style={[styles.habitCard, { backgroundColor: colorScheme === "dark" ? "rgba(21, 23, 24, 0.6)" : "rgba(255, 255, 255, 0.6)" }]}>
            <View style={styles.habitHeader}>
              <Text style={[styles.habitName, { color: colors.text }]}>{mostPracticedHabit.name}</Text>
              <View style={[styles.streakBadge, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.streakText}>{mostPracticedHabit.streak} day streak</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: `${colors.icon}30` }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(mostPracticedHabit.totalCompletions / (mostPracticedHabit.totalCompletions + mostPracticedHabit.failures)) * 100}%`,
                      backgroundColor: COLORS.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={[styles.successText, { color: COLORS.primary }]}>{mostPracticedHabit.totalCompletions} successes</Text>
                <Text style={styles.failureText}>{mostPracticedHabit.failures} failures</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Performance</Text>
          <View style={[styles.chartContainer, { backgroundColor: colorScheme === "dark" ? "rgba(21, 23, 24, 0.6)" : "rgba(255, 255, 255, 0.6)" }]}>
            <BarChart
              data={chartData}
              width={screenWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: colorScheme === "dark" ? "#151718" : "#f5f5f5",
                backgroundGradientTo: colorScheme === "dark" ? "#1A1A2E" : "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                labelColor: (opacity = 1) => `${colors.text}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Habits Summary</Text>
          {mockHabits.map((habit) => (
            <View key={habit.id} style={[styles.habitSummaryCard, { backgroundColor: colorScheme === "dark" ? "rgba(21, 23, 24, 0.6)" : "rgba(255, 255, 255, 0.6)" }]}>
              <View style={styles.habitSummaryHeader}>
                <Text style={[styles.habitSummaryName, { color: colors.text }]}>{habit.name}</Text>
                <Text style={[styles.habitSummaryStreak, { color: COLORS.primary }]}>{habit.streak} days</Text>
              </View>
              <View style={styles.habitSummaryStats}>
                <View style={styles.habitSummaryStatItem}>
                  <View style={[styles.dot, styles.successDot, { backgroundColor: COLORS.primary }]} />
                  <Text style={[styles.habitSummaryStatText, { color: colors.icon }]}>{habit.totalCompletions} successes</Text>
                </View>
                <View style={styles.habitSummaryStatItem}>
                  <View style={[styles.dot, styles.failureDot]} />
                  <Text style={[styles.habitSummaryStatText, { color: colors.icon }]}>{habit.failures} failures</Text>
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
  EditLogoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  profileImageContainer: {
    shadowColor: COLORS.primary,
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
  },
  profileInfo: {
    marginTop: 20,
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: "80%",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  habitCard: {
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
  },
  streakBadge: {
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
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  successText: {
    fontSize: 14,
  },
  failureText: {
    color: "#E94560",
    fontSize: 14,
  },
  chartContainer: {
    alignItems: "center",
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
  },
  habitSummaryStreak: {
    fontSize: 14,
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
    // Color set dynamically
  },
  failureDot: {
    backgroundColor: "#E94560",
  },
  habitSummaryStatText: {
    fontSize: 13,
  },
})

export default Profile