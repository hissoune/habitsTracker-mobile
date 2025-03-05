import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';

const ChallengeDetails = () => {
    const { challengeId } = useLocalSearchParams();

   const {chalenges,isLoading}= useSelector((state:RootState)=>state.chalenge);

   const [chalenge , setChalenge] = useState(chalenges.find((ch)=> ch._id === challengeId))


useEffect(()=> {
    const currentChalenge = chalenges.find((h) => h._id === challengeId);
    if(currentChalenge)
        setChalenge({...currentChalenge})
  },[chalenges]);

    const renderParticipant = ({ item }: { item: { userId: string; progress: number } }) => (
        <View style={styles.participantContainer}>
            <Text style={styles.participantName}>{item.userId}</Text>
            <Text style={styles.participantProgress}>{item.progress}%</Text>
        </View>
    );

    if (!chalenge) {
        <View>
            <Text></Text>
        </View>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{chalenge?.title}</Text>
            <View style={styles.dateContainer}>
                <FontAwesome name="calendar" size={24} color="#fff" />
                <Text style={styles.dateText}>Start Date: {chalenge?.startDate}</Text>
            </View>
            <View style={styles.dateContainer}>
                <FontAwesome name="calendar" size={24} color="#fff" />
                <Text style={styles.dateText}>End Date: {chalenge?.endDate}</Text>
            </View>
            <Text style={styles.sectionTitle}>Participants</Text>
            <FlatList
                data={chalenge?.participants}
                renderItem={renderParticipant}
                keyExtractor={(item) => item.userId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    participantContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    participantName: {
        fontSize: 16,
    },
    participantProgress: {
        fontSize: 16,
    },
});

export default ChallengeDetails;