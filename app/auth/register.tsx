import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import replaceIp from '../helpers/replaceIp';
import { uploadImageToBackend } from '../helpers/minio.helper';
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { registerAction } from '../(redux)/aithSlice';
import { User } from '@/constants/types';
import BirthDayPicker from '@/components/birthDayPicker';
import { useRouter } from 'expo-router';
import { COLORS, Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const {isLoading} = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState<User>({
    name: '',
    email: '',
    password: '',
    birthDay: null,
    image: ""
  });
  
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleConfirm = (date: Date) => {
    setForm({ ...form, birthDay: date });
  };
  
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const image = await uploadImageToBackend(uri);
      setForm({ ...form, image: image || '' });
    }
  };
  
  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const user = await dispatch(registerAction(form)).unwrap();
          ToastAndroid.show("Registred successfully", ToastAndroid.SHORT)
    
    if (user) {
      router.push('/auth/login');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join our community today</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.formContainer}>
            <View style={[styles.formCard, { 
              backgroundColor: colorScheme === 'dark' ? '#1A1A2E' : '#fff',
              shadowColor: colorScheme === 'dark' ? COLORS.primary : '#000',
            }]}>
              <View style={styles.profileImageSection}>
                {form.image ? (
                  <Image
                    source={{ uri: replaceIp(form.image, process.env.EXPO_PUBLIC_REPLACE || "") }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={[styles.imagePlaceholder, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                    <Feather name="user" size={40} color={COLORS.primary} />
                  </View>
                )}
                <TouchableOpacity 
                  style={[styles.uploadButton, { backgroundColor: COLORS.primary }]} 
                  onPress={handleImagePick}
                >
                  <Feather name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Username</Text>
                <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                  <Feather name="user" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your username"
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    value={form.name}
                    onChangeText={(value) => handleChange('name', value)}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
                <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                  <Feather name="mail" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    value={form.email}
                    onChangeText={(value) => handleChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? '#2A2A3C' : '#f5f5f5' }]}>
                  <Feather name="lock" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Create a password"
                    placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#687076'}
                    value={form.password}
                    onChangeText={(value) => handleChange('password', value)}
                    secureTextEntry={secureTextEntry}
                  />
                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                    <Feather 
                      name={secureTextEntry ? "eye" : "eye-off"} 
                      size={20} 
                      color={colorScheme === 'dark' ? '#9BA1A6' : '#687076'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Birthday</Text>
                <BirthDayPicker handleConfirm={handleConfirm} form={form} />
              </View>
              
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                 <Text style={styles.buttonText}>
                  {isLoading ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text>Registering</Text>
                      <ActivityIndicator color={COLORS.primary} size={"large"} style={{ marginLeft: 10 }} />
                    </View>
                  ) : (
                    "Login"
                  )}
                </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.text }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={[styles.loginLink, { color: COLORS.primary }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.backButton, { borderColor: COLORS.primary }]} 
              onPress={() => router.back()}
            >
              <Text style={[styles.backButtonText, { color: COLORS.primary }]}>
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerSection: {
    height: 200,
  },
  headerGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -40,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  registerButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    marginRight: 5,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'center',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;