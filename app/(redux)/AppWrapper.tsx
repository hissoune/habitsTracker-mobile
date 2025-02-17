import  { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loadUser } from "./aithSlice";



const AppWrapper = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {

    dispatch(loadUser())
    

  }, [dispatch]);

  return (
    <Stack>
       <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default AppWrapper;
