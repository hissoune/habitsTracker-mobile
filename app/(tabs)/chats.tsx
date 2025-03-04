import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/Colors';

const users = [
    { id: '1', name: 'User One' },
    { id: '2', name: 'User Two' },
    { id: '3', name: 'User Three' },
];

const Chats = () => {
    const startChat = (userName: string) => {
        // Logic to start chat with the user
        console.log(`Starting chat with ${userName}`);
    };

    const renderItem = ({ item }: { item: { id: string, name: string } }) => (
        <TouchableOpacity style={styles.userContainer} onPress={() => startChat(item.name)}>
            <Text style={styles.userName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chats</Text>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Button title="Start New Chat" color={COLORS.primary} onPress={() => console.log('Start New Chat')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    userContainer: {
        padding: 15,
        backgroundColor: '#1f1f1f',
        borderRadius: 10,
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        color: '#fff',
    },
});

export default Chats;