import { Habit } from "@/constants/types";
import axiosInstance from "../Client";


export const getAllHabits=async()=>{

  
  const response =await axiosInstance.get('habits-service/habits/all');  
  return response.data
}

export const createHabit = async(habit:Habit)=>{
  const response = await axiosInstance.post('habits-service/habits',habit);
  return response.data
}

export const getHabitById=async (habitId:string)=>{
    const response = await axiosInstance.get(`habits-service/habits/${habitId}`);
    return response.data
}

export const reactiveHabit = async (habitId:string) =>{
    const response = await axiosInstance.patch(`habits-service/habits/${habitId}`,{});

    
    return response.data
}

export const deleteHabit = async(habitId:string)=>{
  const response = await axiosInstance.delete(`habits-service/habits/${habitId}`);
  return response.data
}

export const updateHabit = async (habitId:string,habit:Partial<Habit>) =>{
  const response = await axiosInstance.patch(`habits-service/habits/updatehabit/${habitId}`,habit);
  return response.data
}