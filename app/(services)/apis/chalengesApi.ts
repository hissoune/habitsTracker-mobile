
import axiosInstance from "../Client";






export const getAllChalenges =async ()=>{
 
    const response = await axiosInstance.get('chalenges-service/chalenges');
    return response.data

}

export const joinChalenge = async (chalengeId:string)=>{
    console.log(chalengeId);
    
    const response = await axiosInstance.patch(`chalenges-service/chalenges/join-chalenge/${chalengeId}`);
    return response.data
}