import { COLORS } from "@/constants/Colors"
import { Habit, progress } from "@/constants/types"
import { Feather } from "@expo/vector-icons"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { LineChart } from "react-native-chart-kit"

const { width } = Dimensions.get("window")
interface Props {
    habit: Habit,
    isDark: boolean,
    progress: progress | null
 }
const repeatsArray = ({habit,isDark,progress}:Props) => {

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

    return (
        <View>
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
                        progress?  (progress?.streak && day <= progress.streak ? COLORS.primary:isDark?"#333":'#f59e0b') :habit.sucsess && day <= habit.sucsess ? COLORS.primary  : "#333",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
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

});

export default repeatsArray