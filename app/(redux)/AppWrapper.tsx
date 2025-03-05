import  { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadUser } from "./aithSlice";
import io from 'socket.io-client';
import { updateScheduledHabits } from "./hapitSlice";
import { useSelector } from "react-redux";
import { RootState } from "./store";

 
const AppWrapper = () => {

  const router = useRouter()
  const dispatch = useAppDispatch();
  const socket = io("http://192.168.9.30:3001");

  const {user}=useSelector((state:RootState)=>state.auth)
  
  useEffect(() => {
    socket.on('habitUpdated', (data) => {
     if (data.habit.userId == user?._id) {
      dispatch(updateScheduledHabits(data))

     }
    
    });
    
    if (!user) {
      router.push('/')
    }
    return () => {
      socket.close()
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
