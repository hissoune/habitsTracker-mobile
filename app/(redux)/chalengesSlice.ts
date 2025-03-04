
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chalenge } from '../../constants/types';
import { getAllChalenges } from '../(services)/apis/chalengesApi';
import { act } from 'react';


export const getAllChalengesAction = createAsyncThunk(
    "chalenges/all",
    async ()=>{
        const chalenges = await getAllChalenges();
        return chalenges
    }
);


const initialState :{
 chalenges:chalenge[],
 chalenge:chalenge | null,
 isLoading:boolean,
 error:string

}={
    chalenges:[],
    chalenge:null,
    isLoading:false,
    error:''

}

const chalengesSlice = createSlice({
    name: 'chalenges',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
       builder
       .addCase(getAllChalengesAction.pending, (state,action)=>{
        state.isLoading = true
       })
       .addCase(getAllChalengesAction.fulfilled,(state,action)=>{
        state.chalenges = action.payload
        state.isLoading = false
       })
       .addCase(getAllChalengesAction.rejected, (state)=>{
        state.error = "dgfhjukilom",
        state.isLoading = false

       })
    }
});

export const chalengesReducer= chalengesSlice.reducer