import registerForPushNotifications from "@/app/helpers/registerTonotifications";
import axiosInstance from "../Client";



export const  getAndsendTokenToBackend = async (userId:string)=>{
    const token = await registerForPushNotifications();
    
    if (token && userId) {
      try {
        await axiosInstance.post(`notifications-service/notifications/token`, {
          userId: userId,
          pushToken: token,
        });
        console.log('Token sent to backend successfully');
      } catch (error) {
        console.error('Failed to send token to backend:', error);
        
      }
    }

}

export const rmovePushTokenAfterLogout=async (userId:string)=>{
    try {
        await axiosInstance.delete(`notifications-service/notifications/token/${userId}`);
        console.log('Token will be removed from  the backend successfully');
      } catch (error) {
        console.error('Failed remove the token from backend:', error);
        
      }
}