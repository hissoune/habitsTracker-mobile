
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chalenge } from '../../constants/types';
import { getAllChalenges, joinChalenge } from '../(services)/apis/chalengesApi';
import { act } from 'react';


export const getAllChalengesAction = createAsyncThunk(
    "chalenges/all",
    async ()=>{
        const chalenges = await getAllChalenges();
        return chalenges
    }
);

export const joinChalengeAction = createAsyncThunk(
    "chalenges/join",
    async (chalengeId:string)=>{
        const chalenge = await joinChalenge(chalengeId);
        return chalenge;
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
       .addCase(joinChalengeAction.pending, (state)=>{
        state.isLoading = true
       })
       .addCase(joinChalengeAction.fulfilled, (state,action)=>{
        state.chalenges = state.chalenges.map((chalenge)=> chalenge._id ==action.payload._id?action.payload:chalenge )
        state.isLoading = false
       })
       .addCase(joinChalengeAction.rejected, (state)=>{
          state.error = "sdfghjk"
       })
    }
});

export const chalengesReducer= chalengesSlice.reducer