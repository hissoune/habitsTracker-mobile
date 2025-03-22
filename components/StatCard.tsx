import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

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

  const styles = StyleSheet.create({ 
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
  })

  export default StatCard