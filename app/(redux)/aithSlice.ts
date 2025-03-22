import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from '@/constants/types';
import { getAllUsers, login, register } from '../(services)/apis/authApi';
import { getAndsendTokenToBackend, rmovePushTokenAfterLogout } from '../(services)/apis/notificationsApi';

const initialState:{
    user: User |null,
    users:User[]
    token:string | null,
    inAuth: boolean,
    isLoading: boolean,
    error: string | null,
} = {
    user: null,
    users:[],
    token:null,
    inAuth: false,
    isLoading: false,
    error: null,
};

export const registerAction = createAsyncThunk(
    'auth/register',
    async (user:User) => {
      const User = await register(user);
      return User;
    }
);
export const loginAction= createAsyncThunk(
    "auth/login",
    async (Credentials:{email:string,password:string})=>{
       const response = await login(Credentials);
        await getAndsendTokenToBackend(response.user._id)
       return response;
    }
);

export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async ()=>{
        const user= await AsyncStorage.getItem("user");
        const token= await AsyncStorage.getItem("token");
        //add here the call of the function of verify the token 
        //.....           
        return user && token ? JSON.parse(user):null;
    }
);

export const getAllUsersAction = createAsyncThunk(
    "auth/allUsers",
    async ()=>{
        const users = await getAllUsers();
        return users
    }
);

export const logoutAction = createAsyncThunk(
    "auth/logout",
    async (userId:string)=>{
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
        await rmovePushTokenAfterLogout(userId)
        return null
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                if (action.payload != null){
                    state.user=action.payload;
                    state.inAuth=true;
                
                }
                state.isLoading=false

            })
            .addCase(loadUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = 'user not exist';
            })
            .addCase(registerAction.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(registerAction.fulfilled, (state,action)=>{
                state.user = action.payload;
                console.log(state.user);
                
                state.isLoading = false;
            })
            .addCase(registerAction.rejected, (state,action)=>{
                state.error = 'registration fail'
                state.isLoading=false
            })
            .addCase(loginAction.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(loginAction.fulfilled, (state,action)=>{
                state.user = action.payload.user;
                state.inAuth = true
                state.token = action.payload.token;
                AsyncStorage.setItem('user',JSON.stringify(action.payload.user));
                AsyncStorage.setItem('token',action.payload.token);
                state.isLoading = false

            })
            .addCase(loginAction.rejected, (state)=>{
                state.error = "login faioled";
                state.isLoading = false
            })
            .addCase(getAllUsersAction.pending, (state)=>{
                state.isLoading = true
            })
            .addCase(getAllUsersAction.fulfilled, (state,action)=>{
                state.users = action.payload,
                state.isLoading = false
            })
            .addCase(getAllUsersAction.rejected, (state)=>{
                state.error ="not for you "
            })
            .addCase(logoutAction.fulfilled, (state)=>{
                state.user = null ;
                state.token = null; 
                state.inAuth = false;
            })
            
    },
});
export const authReducer =authSlice.reducer ;

