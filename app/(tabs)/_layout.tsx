import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { COLORS, Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MyHabits"
        options={{
          title: 'My Habits',
          tabBarIcon: ({ color }) => (
            // <FontAwesome size={28} name="hourglass-start" color={color} /> 
            <MaterialIcons name="trending-up" size={24} color={COLORS.primary} />

          ),
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => (
            <Image
              source={{ uri: "https://i.pinimg.com/736x/c8/ff/aa/c8ffaa95a5887df6b537de8aff0da2be.jpg" }}
              style={styles.profileImage}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chalenges"
        options={{
          title: 'Chalenges',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="emoji-events" size={28} color={COLORS.primary} />

          ),
        }}
      />
       <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => (
         <MaterialIcons name="chat-bubble" size={24} color={COLORS.primary} />

          ),
        }}
      />
     
    </Tabs>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#6C63FF",
  },
})