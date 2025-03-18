import  { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadUser } from "./aithSlice";
import io from 'socket.io-client';
import { updateScheduledHabits } from "./hapitSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { updateRealTimechalenges } from "./chalengesSlice";
import * as Notifications from 'expo-notifications';
import { Alert } from "react-native";
import axios from "axios";
import { registerForPushNotificationsAsync } from "../helpers/pushNotificationsPermission";

 
const AppWrapper = () => {

  const router = useRouter()
  const dispatch = useAppDispatch();
  const habitssocket = io(process.env.EXPO_PUBLIC_HABITS);
  const chalengesSocket = io(process.env.EXPO_PUBLIC_CHALENGES)
  const {user}=useSelector((state:RootState)=>state.auth)

  useEffect(() => {



    habitssocket.on('habitUpdated', (data) => {
     if (data.habit.userId == user?._id) {
      dispatch(updateScheduledHabits(data))
       
     }
    
    });
    chalengesSocket.on('chalengeUpdated', (data)=>{
             
        dispatch(updateRealTimechalenges(data))
      
    });
    
    if (!user) {
      router.push('/')
    }
    
    return () => {
      habitssocket.close()
      chalengesSocket.close()
    }

    
  },[user])

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

 

 
  

  useEffect(() => {
    // async function registerForPushNotifications() {
    //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //   let finalStatus = existingStatus;

    //   if (existingStatus !== 'granted') {
    //     const { status } = await Notifications.requestPermissionsAsync(); 
    //     finalStatus = status;
    //   }
    
    //   if (finalStatus !== 'granted') {
    //     Alert.alert('Permission required', 'You need to allow notifications');
    //     return;
    //   }
    
    //   const token = (await Notifications.getExpoPushTokenAsync()).data;
    //   setExpoPushToken(token);
    
    //   if (user?._id) {
    //     await axios.post(`${process.env.EXPO_PUBLIC_URL}/notifications-service/notifications/token`, {
    //       userId: user._id, 
    //       pushToken: token
    //     });
    //   }
    // }
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {

    dispatch(loadUser())
    

  }, [dispatch]);

  return (
    <Stack>
       <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default AppWrapper;
