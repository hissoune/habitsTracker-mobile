import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { Icon } from "@rneui/themed"
import { useRouter } from "expo-router"
import { ProgressChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins"
import { useSelector } from "react-redux"
import { RootState } from "./(redux)/store"
import { useEffect } from "react"
import { COLORS, Colors } from "@/constants/Colors"

const screenWidth = Dimensions.get("window").width

const LandingPage = () => {
  const router = useRouter();
  const scrollY = new Animated.Value(0);
  const { inAuth, isLoading } = useSelector((state: RootState) => state.auth);
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  // Always call hooks at the top level
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (!isLoading && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isLoading, inAuth]);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const data = {
    labels: ["Success", "Habits", "Challenges"],
    data: [0.85, 0.75, 0.65],
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? "light" : "dark"} />
      
      <Animated.View style={[
        styles.header, 
        { 
          opacity: headerOpacity, 
          backgroundColor: colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        }
      ]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Habits Tracker</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.container}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.title}>Transform Your Habits</Text>
              <Text style={styles.description}>
                Track your progress, take on challenges, and improve your well-being day by day.
              </Text>
              <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
                <LinearGradient
                  colors={[COLORS.secondary, COLORS.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Icon name="rocket" type="font-awesome" color="#fff" size={20} />
                  <Text style={styles.buttonText}>Get Started Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.chartContainer, { 
          backgroundColor: colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          shadowColor: colorScheme === 'dark' ? COLORS.primary : '#000',
        }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Your Progress</Text>
          <ProgressChart
            data={data}
            width={screenWidth * 0.85}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              backgroundGradientFrom: colorScheme === 'dark' ? '#1A1A2E' : '#f5f5f5',
              backgroundGradientTo: colorScheme === 'dark' ? '#2A2A3C' : '#ffffff',
              color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
              labelColor: (opacity = 1) => `${colors.text}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
              style: {
                borderRadius: 16,
              },
            }}
            hideLegend={false}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
        
        <View style={styles.featuresSection}>
          <FeatureItem
            icon="target"
            title="Custom Goals"
            description="Set and track your personal objectives"
            colorScheme={colorScheme}
            colors={colors}
          />
          <FeatureItem
            icon="trending-up"
            title="Progress Tracking"
            description="Visualize your improvements over time"
            colorScheme={colorScheme}
            colors={colors}
          />
          <FeatureItem
            icon="award"
            title="Motivating Challenges"
            description="Join challenges to stay motivated"
            colorScheme={colorScheme}
            colors={colors}
          />
          <FeatureItem
            icon="users"
            title="Community Support"
            description="Connect with others on similar journeys"
            colorScheme={colorScheme}
            colors={colors}
          />
        </View>

        <View style={styles.testimonialSection}>
          <LinearGradient
            colors={colorScheme === 'dark' 
              ? ['rgba(78, 205, 196, 0.2)', 'rgba(30, 27, 75, 0.2)'] 
              : ['rgba(78, 205, 196, 0.1)', 'rgba(30, 27, 75, 0.1)']}
            style={styles.testimonialGradient}
          >
            <Text style={[styles.testimonialText, { color: colors.text }]}>
              "This app has completely transformed how I approach my daily habits. The challenges keep me motivated!"
            </Text>
            <Text style={[styles.testimonialAuthor, { color: colors.icon }]}>- Sarah J.</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={navigateToLogin}>
          <Text style={[styles.secondaryButtonText, { color: COLORS.primary }]}>Learn More</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title, description, colorScheme, colors }: {
  icon: string;
  title: string;
  description: string;
  colorScheme: string;
  colors: any;
}) => (
  <View style={[styles.featureItem, { 
    backgroundColor: colorScheme === 'dark' ? 'rgba(21, 23, 24, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    shadowColor: colorScheme === 'dark' ? COLORS.primary : '#000',
  }]}>
    <View style={styles.featureIconContainer}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.featureIconGradient}
      >
        <Icon name={icon} type="feather" color="#fff" size={24} />
      </LinearGradient>
    </View>
    <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
    <Text style={[styles.featureDescription, { color: colors.icon }]}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
  },
  safeArea: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSection: {
    width: '100%',
    height: 400,
    marginBottom: 30,
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  chartTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  featuresSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureItem: {
    width: '48%',
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  featureIconContainer: {
    marginBottom: 10,
    borderRadius: 50,
    overflow: 'hidden',
  },
  featureIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    textAlign: "center",
  },
  testimonialSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  testimonialGradient: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  testimonialText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: "center",
    marginBottom: 10,
  },
  testimonialAuthor: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    textAlign: "right",
  },
  secondaryButton: {
    alignSelf: 'center',
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  secondaryButtonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
});

export default LandingPage