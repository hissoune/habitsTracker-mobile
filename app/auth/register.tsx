import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { replaceIp } from '../helpers/replaceIp';
import { uploadImageToBackend } from '../helpers/minio.helper';
import * as ImagePicker from "expo-image-picker"
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { registerAction } from '../(redux)/aithSlice';
import { User } from '@/constants/types';
import BirthDayPicker from '@/components/birthDayPicker';
import { useRouter } from 'expo-router';

const Register = () => {
    const router = useRouter()
    
    const dispatch = useAppDispatch()
    const [form, setForm] = useState<User>({
        name: '',
        email: '',
        password: '',
        birthDay:null,
        image: ""
    });

    const handleConfirm = (date:Date) => {
        setForm({ ...form, birthDay: date });
    };
    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
    
        if (!result.canceled) {
          const uri = result.assets[0].uri
          const image = await uploadImageToBackend(uri)
          setForm({ ...form, image: image || '' })
        }
      }
      
    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit =async () => {
     const user = await   dispatch(registerAction(form)).unwrap()
     if (user) {
        router.push('/auth/login')
     }
        
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={form.name}
                onChangeText={(value) => handleChange('name', value)}
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
       
       <BirthDayPicker handleConfirm={handleConfirm} form={form}/>
                <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
                    <Feather name="upload-cloud" size={40} color="#FF9900" />
                  </TouchableOpacity>

                  {form.image ? (
                    <Image
                      source={{ uri: replaceIp(form.image, process.env.EXPO_PUBLIC_REPLACE || "") }}
                      style={styles.imagePreview}
                    />
                  ) : (
                    <Text style={styles.noImageText}>No image selected</Text>
                  )}
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
    imageButton: {
        marginTop: 20,
        backgroundColor: "#fff",
        paddingVertical: 15,
        borderColor: "#FF9900",
        borderWidth: 1,
        borderRadius: 10,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        alignItems: "center",
      },
      buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
      imagePreview: {
        width: 200,
        height: 200,
        marginTop: 10,
        alignSelf: "center",
        borderRadius: 10,
      },
      noImageText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginTop: 10,
      },
});

export default Register;