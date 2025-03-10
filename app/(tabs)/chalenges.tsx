"use client"

import { useAppDispatch } from "@/hooks/useAppDispatch"
import {  Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect } from "react"
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native"
import { useSelector } from "react-redux"
import type { RootState } from "../(redux)/store"
import { getAllChalengesAction } from "../(redux)/chalengesSlice"
import { useRouter } from "expo-router"
import { Colors, COLORS } from "@/constants/Colors"
import { ChallengeCard } from "@/components/ui/renderChalenge"
import { ComonStyles } from "@/components/ui/comonStyles"

const Chalenges = () => {
  const dispatch = useAppDispatch()
  const { chalenges, isLoading } = useSelector((state: RootState) => state.chalenge)
  const router = useRouter()

  const colorScheme = useColorScheme() || "light"
  const colors = Colors[colorScheme]

  const stats = { challenges: 10, participants: 150, likes: 1200 }

  useEffect(() => {
    dispatch(getAllChalengesAction())
  }, [dispatch])

  

  

  if (isLoading) {
    return (
      <View style={[ComonStyles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{ uri: "https://i.pinimg.com/736x/da/44/34/da4434b3365332fcfb13be7325553cf7.jpg" }}
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient colors={["transparent", COLORS.primary]} style={styles.header}>
              <View style={styles.statsContainer}>
                {Object.entries(stats).map(([key, value]) => (
                  <View key={key} style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: "#fff" }]}>{value}</Text>
                    <Text style={[styles.statLabel, { color: "#fff", opacity: 0.8 }]}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <View>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Feather name="search" size={20} color={colors.text} style={styles.searchIcon} />
              <TextInput
                placeholder="Search challenges..."
                placeholderTextColor={colors.text + "80"}
                style={[styles.searchInput, { color: colors.text }]}
              />
            </View>
            <TouchableOpacity 
              style={styles.userChallengesButton}
              onPress={() => router.push('/details/userChalenges')}
            >
              <Feather name="user" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
                <Text style={styles.filterButtonTextActive}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={[styles.filterButtonText, { color: colors.text }]}>Weekly</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={[styles.filterButtonText, { color: colors.text }]}>Monthly</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
          <FlatList
            data={chalenges}
            renderItem={({ item }) => <ChallengeCard item={item} />}
            keyExtractor={(item) => (item._id ? item._id.toString() : "")}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 200,
  },
  headerImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  headerImageStyle: {
    borderRadius: 10,
  },
 
  header: {
    padding: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  joinButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  creator: {
    fontSize: 12,
    marginBottom: 8,
  },
  participants: {
    fontSize: 12,
    marginBottom: 8,
  },
  stats: {
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
  },
  userChallengesButton: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
})

export default Chalenges

