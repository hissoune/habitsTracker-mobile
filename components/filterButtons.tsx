import { getStatusColor } from "@/app/helpers/habitHelper";
import { COLORS } from "@/constants/Colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme } from "react-native";

const FilterButtons = ({activeFilter, setActiveFilter }: {activeFilter:string, setActiveFilter: any}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
  
   
  
    const filters = [
      {
        label: "All",
        value: "all",
        icon: <MaterialIcons name="error" size={20} color={getStatusColor("all")} />,
      },
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
    ];
  
    return (
      <ScrollView
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer} 
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              isDark && styles.filterButtonDark,
              activeFilter === filter.value && styles.activeButton,
            ]}
            onPress={() => {
              setActiveFilter(filter.value);
            }}
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
      </ScrollView>
    );
  };
const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        gap: 8, 
        justifyContent: "space-around",
        marginBottom: 20,
      },
      filterButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        gap: 6,
        paddingHorizontal: 12, 
        paddingVertical: 5, 
        borderRadius: 20, 
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4, 
        elevation: 3,
        minWidth: 80,
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
})

  export default FilterButtons;