import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    user: null,
    inAuth: false,
    isLoading: false,
    error: null as string | null,
};

export const authenticateUser = createAsyncThunk(
    'auth/authenticateUser',
    async (userCredentials) => {
      
    }
);

export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async ()=>{
        const warehouseman= await AsyncStorage.getItem("user");
           
           
        return warehouseman ? JSON.parse(warehouseman):null;
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
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
            });
    },
});

export const authReducer =authSlice.reducer ;

