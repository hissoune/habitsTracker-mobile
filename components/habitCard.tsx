import { CircularProgress } from "@/components/CircularProgress"
import { getStatusBgColor, getStatusColor } from "@/app/helpers/habitHelper"
import { COLORS } from "@/constants/Colors"
import { Habit } from "@/constants/types"
import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native"

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
              <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(habit.status ?? "", isDark) }]}>
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
  const styles = StyleSheet.create({
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
  export default HabitCard