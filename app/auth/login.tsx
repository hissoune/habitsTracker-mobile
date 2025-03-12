import { User } from '@/constants/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { loginAction } from '../(redux)/aithSlice';
import { COLORS, Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };
  
  const handleSubmit = async () => {
    try {
      const response = await dispatch(loginAction(form));
  
      if (loginAction.rejected.match(response)) {
        setErrorMessage((response.payload as string) || "Login failed. Please try again.");
        return;
      }
  
      router.push("/(tabs)");
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      console.error("Login error:", error);
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
              <Text style={styles.title}>Habit Tracker</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
            {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}

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
                    placeholder="Enter your password"
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
              
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleSubmit}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.forgotPasswordLink} 
                onPress={() => router.push("/auth/forgotPassword")}
              >
                <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: colors.text }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text style={[styles.registerLink, { color: COLORS.primary }]}>
                  Register
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
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
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
  loginButton: {
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
  forgotPasswordLink: {
    alignSelf: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  registerText: {
    fontSize: 16,
    marginRight: 5,
  },
  registerLink: {
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

export default LoginScreen;