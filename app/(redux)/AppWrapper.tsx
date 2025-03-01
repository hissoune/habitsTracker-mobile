import  { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadUser } from "./aithSlice";
import io from 'socket.io-client';
import { updateScheduledHabits } from "./hapitSlice";

 
const AppWrapper = () => {

  const dispatch = useAppDispatch();
const socket = io("http://192.168.9.30:3001");
socket.on('habitUpdated', (data) => {
  dispatch(updateScheduledHabits(data))
 
});
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
