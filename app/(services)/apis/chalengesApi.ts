
import axiosInstance from "../Client";






export const getAllChalenges =async ()=>{
 
    const response = await axiosInstance.get('chalenges-service/chalenges');
    return response.data

}