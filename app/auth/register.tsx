import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        address: '',
        phoneNumber: '',
    });

    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        // Handle form submission
        console.log(form);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={form.username}
                onChangeText={(value) => handleChange('username', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={form.password}
                onChangeText={(value) => handleChange('password', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={form.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={form.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={form.age}
                onChangeText={(value) => handleChange('age', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Gender"
                value={form.gender}
                onChangeText={(value) => handleChange('gender', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChangeText={(value) => handleChange('address', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChangeText={(value) => handleChange('phoneNumber', value)}
            />
            <Button title="Register" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
});

export default Register;