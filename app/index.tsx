import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from "react-native"
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

const screenWidth = Dimensions.get("window").width

const LandingPage = () => {
  const router = useRouter();
  const scrollY = new Animated.Value(0);
  const { inAuth, isLoading } = useSelector((state: RootState) => state.auth);

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
    console.log(inAuth);
    
  }, [isLoading, inAuth]);

  if (!fontsLoaded) {
    return null; // Safe to return here since fontsLoaded is a hook
  }

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const data = {
    labels: ["Succès", "Habitudes", "Défis"],
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1999&q=80",
        }}
        style={styles.background}
      >
        <LinearGradient colors={["rgba(0,0,0,0.7)", "transparent"]} style={styles.gradient} />
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <Text style={styles.headerTitle}>Habits Tracker</Text>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.container}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          <View style={styles.heroSection}>
            <Text style={styles.title}>Transformez vos habitudes</Text>
            <Text style={styles.description}>
              Suivez vos progrès, relevez des défis et améliorez votre bien-être jour après jour.
            </Text>
            <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
              <Icon name="rocket" type="font-awesome" color="#fff" size={20} />
              <Text style={styles.buttonText}>Commencer maintenant</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Votre progression</Text>
            <ProgressChart
              data={data}
              width={screenWidth * 0.9}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundGradientFrom: "#182952",
                backgroundGradientTo: "#2A4494",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              hideLegend={false}
            />
          </View>

          <View style={styles.featuresSection}>
            <FeatureItem
              icon="target"
              title="Objectifs personnalisés"
              description="Définissez et suivez vos objectifs personnels"
            />
            <FeatureItem
              icon="trending-up"
              title="Suivi des progrès"
              description="Visualisez vos améliorations au fil du temps"
            />
            <FeatureItem
              icon="award"
              title="Défis motivants"
              description="Participez à des défis pour rester motivé"
            />
          </View>

          <TouchableOpacity style={styles.secondaryButton} onPress={navigateToLogin}>
            <Text style={styles.secondaryButtonText}>En savoir plus</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};


const FeatureItem = ({ icon, title, description }:{icon:any,title:string,description:string}) => (
  <View style={styles.featureItem}>
    <Icon name={icon} type="feather" color="#4A90E2" size={40} />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
)

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },

  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 1000,
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "#fff",
  },
  container: {
    alignItems: "center",
    paddingTop: 60,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    color: "#E0E0E0",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  chartContainer: {
    marginBottom: 40,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  chartTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  featuresSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  featureItem: {
    width: "45%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  featureTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  featureDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#E0E0E0",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4A90E2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 40,
  },
  secondaryButtonText: {
    fontFamily: "Poppins_600SemiBold",
    color: "#4A90E2",
    fontSize: 18,
  },
})

export default LandingPage

