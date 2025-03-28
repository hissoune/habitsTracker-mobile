import  { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadUser } from "./aithSlice";
import io from 'socket.io-client';
import { updateScheduledHabits } from "./hapitSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { updateRealTimechalenges } from "./chalengesSlice";
import * as Notifications from 'expo-notifications';



 
const AppWrapper = () => {

  const router = useRouter()
  const dispatch = useAppDispatch();
  const habitssocket = io(process.env.EXPO_PUBLIC_HABITS);
  const chalengesSocket = io(process.env.EXPO_PUBLIC_CHALENGES)

  useEffect(() => {

    dispatch(loadUser())
    

  }, [dispatch]);

  const {user}=useSelector((state:RootState)=>state.auth)

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {



    habitssocket.on('habitUpdated', (data) => {
     if (data.habit.userId == user?._id) {
      dispatch(updateScheduledHabits(data))
       
     }
    
    });
    chalengesSocket.on('chalengeUpdated', (data)=>{
      
        dispatch(updateRealTimechalenges(data));
      
    });

    
    
    if (!user) {
      router.push('/')
    }
    
    return () => {
      habitssocket.close()
      chalengesSocket.close()
    }

    
  },[user])






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
