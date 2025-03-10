import  { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadUser } from "./aithSlice";
import io from 'socket.io-client';
import { updateScheduledHabits } from "./hapitSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { updateRealTimechalenges } from "./chalengesSlice";
import { registerForPushNotificationsAsync } from "../helpers/pushNotificationsPermission";

 
const AppWrapper = () => {

  const router = useRouter()
  const dispatch = useAppDispatch();
  const habitssocket = io(process.env.EXPO_PUBLIC_HABITS);
  const chalengesSocket = io(process.env.EXPO_PUBLIC_CHALENGES)
  const {user}=useSelector((state:RootState)=>state.auth)
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });


    habitssocket.on('habitUpdated', (data) => {
     if (data.habit.userId == user?._id) {
      dispatch(updateScheduledHabits(data))

     }
    
    });
    chalengesSocket.on('chalengeUpdated', (data)=>{
      if (data.userId == user?._id) {        
        dispatch(updateRealTimechalenges(data))
       }
    });
    
    if (!user) {
      router.push('/')
    }
    return () => {
      habitssocket.close()
      chalengesSocket.close()
    }

    
  },[user])

  
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
