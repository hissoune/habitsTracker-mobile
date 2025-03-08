import axiosInstance from "../Client";


export const getParticipantProgress = async (chalengeId:string )=>{
    const response = await axiosInstance.get(`chalenges-service/progress/${chalengeId}`);
    return response.data
}

export const compleeteProgress = async (chalengeId:string )=>{

}