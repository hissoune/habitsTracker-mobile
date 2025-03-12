import { RootState } from "@/app/(redux)/store";
import replaceIp from "@/app/helpers/replaceIp";
import { COLORS, Colors } from "@/constants/Colors";
import { Dimensions, Image, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useSelector } from "react-redux";


const RenderParticipant = ({ item, index }: { item: { userId: string; progress: number,userDetails:any }; index: number }) => {
    const width = Dimensions.get("window").width;
 const colorScheme = useColorScheme() || 'light'
  const colors = Colors[colorScheme]
  const { user } = useSelector((state: RootState) => state.auth)

return (
    <ScrollView horizontal contentContainerStyle={[styles.participantContainer, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
        
      <View style={styles.participantInfo}>
        <View style={[styles.participantRank, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]}>
          <Text style={[styles.rankText, { color: colors.text }]}>{index + 1}</Text>
        </View>
     <Image source={{ uri: replaceIp(item.userDetails.image,process.env.EXPO_PUBLIC_REPLACE || "")  }} style={styles.avatar} />    
     <Text style={[styles.participantName, { color: colors.text }]}>{item.userDetails.name}</Text>
      </View>
      <View style={[styles.progressBarContainer, { width: width * 0.35 }]}>
        <View style={[styles.progressBarBackground, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${item.progress}%`,
                backgroundColor: item.progress > 75 ? "#4CAF50" : item.progress > 40 ? "#FFC107" : COLORS.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.participantProgress, { color: colors.text }]}>{item.progress}%</Text>
      </View>
    </ScrollView>
  )

}

const styles = StyleSheet.create({
    participantContainer: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
      },
      participantInfo: {
        flexDirection: "row",
        alignItems: "center",
      },
      participantRank: {
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      },
      rankText: {
        fontWeight: "bold",
        fontSize: 14,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      participantName: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "500",
      },
      progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      progressBarBackground: {
        height: 8,
        borderRadius: 4,
        flex: 1,
        overflow: "hidden",
      },
      progressBar: {
        height: "100%",
        borderRadius: 4,
      },
      participantProgress: {
        fontSize: 14,
        marginLeft: 8,
        fontWeight: "bold",
        width: 40,
        textAlign: "right",
      },
      participantList: {
        paddingBottom: 20,
      },
      emptyLeaderboard: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      },
      emptyText: {
        fontSize: 16,
        textAlign: "center",
      },
});

export default RenderParticipant