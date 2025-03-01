import { User } from '@/constants/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { loginAction } from '../(redux)/aithSlice';


const LoginScreen = () => {
      const router = useRouter();
      const dispatch = useAppDispatch();
  const [form, setForm] = useState({
      
        email: '',
        password: '',
     
    });
    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };
  
  const handleSubmit = async () => {
    try {
      await  dispatch(loginAction(form));
        router.push("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
    }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Habit Tracker</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                placeholderTextColor="#aaa"
                onChangeText={(value) => handleChange('email', value)}

                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                onChangeText={(value) => handleChange('password', value)}
                value={form.password}

                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() =>router.push("/auth/register") }>
                    <Text style={styles.link}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/auth/forgotPassword")}>
                    <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        fontSize: 16,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#6200ee',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    link: {
        color: '#6200ee',
        fontSize: 16,
    },
});

export default LoginScreen;