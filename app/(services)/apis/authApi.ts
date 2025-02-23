import { User } from "@/constants/types";
import axiosInstance from "../Client";



export const register = async (user:User)=>{
    
    const response = await axiosInstance.post('/auth/register',user);

    return response.data

}

export const login = async (user: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post('/auth/login', user);
      console.log("Login Response: ", response);
      return response.data;
    } catch (error) {
  
        const err = error as any;
        console.error("Login Error: ", err.response ? err.response.data : err.message);
    
      throw error;
    }
  };