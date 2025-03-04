import { useAppDispatch } from '@/hooks/useAppDispatch';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { getAllChalengesAction } from '../(redux)/chalengesSlice';

const COLORS = {
  primary: '#6200ee', 
  secondary: '#03dac6', 
  background: '#121212', 
  text: '#ffffff', 
  cardBackground: '#1e1e1e', 
};

const Chalenges = () => {
 const dispatch = useAppDispatch()
 const {chalenges,isLoading}=useSelector((state:RootState)=>state.chalenge); 
  const isDark = true; 
  const stats = { challenges: 10, participants: 150, likes: 1200 }; 
  useEffect(()=>{
      dispatch(getAllChalengesAction())
  },[chalenges,dispatch])


  const renderChallenge = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: COLORS.cardBackground }]}>
      <View style={styles.challengeHeader}>
        <Image source={{ uri: item.creator.avatar }} style={styles.avatar} />
        <TouchableOpacity
          style={styles.joinButton}
          activeOpacity={0.8}
        >
          <AntDesign name="deleteusergroup" size={24} color={COLORS.text} />
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

  if (isLoading) {
      <View style={[styles.loaderContainer, isDark && styles.loaderContainerDark]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{ uri: 'https://i.pinimg.com/736x/da/44/34/da4434b3365332fcfb13be7325553cf7.jpg' }}
            style={styles.headerImage}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient colors={['transparent', COLORS.secondary]} style={styles.header}>
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
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Today's Challenges</Text>
          <FlatList
            data={chalenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => item._id ? item._id.toString() : ""}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    height: 200,
  },
  headerImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  headerImageStyle: {
    borderRadius: 10,
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
  header: {
    padding: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
    marginBottom: 8,
  },
  creator: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    marginBottom: 8,
  },
  participants: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
    marginBottom: 8,
  },
  stats: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },
});

export default Chalenges;