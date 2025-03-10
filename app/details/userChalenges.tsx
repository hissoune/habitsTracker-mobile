import { Colors, COLORS } from '@/constants/Colors';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, TextInput, useColorScheme, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { ChallengeCard } from '@/components/ui/renderChalenge';
import { ComonStyles } from '@/components/ui/comonStyles';

const UserChallenges = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
      const router = useRouter()
     const colorScheme = useColorScheme() || "light"
      const colors = Colors[colorScheme]
      const { chalenges, isLoading } = useSelector((state: RootState) => state.chalenge)


    const handleSubscribe = () => {
        setIsSubscribed(true);
    };

    if (isLoading) {
        return (
          <View style={[ComonStyles.loaderContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )
      }

    return (
        <View style={styles.container}>
            {isSubscribed ? (
                <>
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
                        onPress={() => ''}
                        >
                        <Octicons name="diff-added" size={24} color={colors.text} />
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
                        <FlatList
                              data={chalenges}
                              renderItem={({ item }) => <ChallengeCard item={item} />}
                              keyExtractor={(item) => (item._id ? item._id.toString() : "")}
                              scrollEnabled={false}
                            />
                    <TouchableOpacity style={styles.createChalengeButton}>
                        <Text>
                        Create New Challenge
                        </Text>
                    </TouchableOpacity>
                   
                </>
            ) : (
                <View style={styles.subscriptionContainer}>
                    <Text style={styles.subscriptionText}>You need to subscribe to access challenges.</Text>
                    <Button title="Subscribe Now" onPress={handleSubscribe} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    challengeItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    subscriptionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptionText: {
        fontSize: 18,
        marginBottom: 16,
    },
    createChalengeButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        // backgroundColor:'#000'
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
});

export default UserChallenges;