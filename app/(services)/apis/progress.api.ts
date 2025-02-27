import axiosInstance from "../Client";



export const getProgress = async (habitId:string)=>{
   const response = await axiosInstance.get(`habits-service/progress/${habitId}`);
   
   return response.data
}

export const completProgress = async (progressId:string)=>{
    const response = await axiosInstance.patch(`habits-service/progress/compleet/${progressId}`,{});
   
   return response.data
}