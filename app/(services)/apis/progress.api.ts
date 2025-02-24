import axiosInstance from "../Client";



export const getProgress = async (habitId:string)=>{
   const response = await axiosInstance.get(`progress/${habitId}`);
   return response.data
}