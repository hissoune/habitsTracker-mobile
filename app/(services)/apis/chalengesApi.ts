
import { chalenge } from "@/constants/types";
import axiosInstance from "../Client";


export const getAllChalenges =async ()=>{
 
    const response = await axiosInstance.get('chalenges-service/chalenges');
    return response.data

}

export const joinChalenge = async (chalengeId:string)=>{
    
    const response = await axiosInstance.patch(`chalenges-service/chalenges/join-chalenge/${chalengeId}`);    
    return response.data
}

export const createChalenge = async (chalenge:chalenge) =>{
    const response = await axiosInstance.post('chalenges-service/chalenges',chalenge);
    return response.data
}

export const deleteChalenge =async (chalengeId:string)=>{
    const response = await axiosInstance.delete(`chalenges-service/chalenges/${chalengeId}`);
    return response.data
}

export const updateChalenge = async (chalengeId:string,chalenge:Partial<chalenge>)=>{
    const response = await axiosInstance.patch(`chalenges-service/chalenges/${chalengeId}`,chalenge);
    return response.data
}