import { Habit } from "@/constants/types";
import axiosInstance from "../Client";


export const getAllHabits=async()=>{
  const response =await axiosInstance.get('/habits/all');
  return response.data
}

export const createHabit = async(habit:Habit)=>{
  const response = await axiosInstance.post('/habits',habit);
  return response.data
}

export const getHabitById=async (habitId:string)=>{
    const response = await axiosInstance.get(`/habits/${habitId}`);
    return response.data
}