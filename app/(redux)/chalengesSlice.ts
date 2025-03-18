
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chalenge, chalengeProgress } from '../../constants/types';
import { createChalenge, deleteChalenge, getAllChalenges, joinChalenge, updateChalenge } from '../(services)/apis/chalengesApi';
import { compleeteProgress, getParticipantProgress } from '../(services)/apis/chalengeProgress';
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

export const createChalengeAction = createAsyncThunk(
    "chalenges/create",
    async (chalenge:chalenge)=>{
    const challenge = await createChalenge(chalenge);
    return challenge
    }
);

export const updateChalengeActon = createAsyncThunk(
    "chalenges/update",
    async ({ chalengeId, chalenge }: { chalengeId: string, chalenge: Partial<chalenge> })=>{
        const challenge = await updateChalenge(chalengeId,chalenge);
        return challenge
    }
);

export const deleteChalengeAction = createAsyncThunk(
    "chalenges/delete",
    async (chalengeId:string)=>{
        const challenge = await deleteChalenge(chalengeId);
        return challenge
    }
);

export const  getParticipantProgressAction = createAsyncThunk(
    "chalenges/participantProgress",
    async (chalengeId:string)=>{
        const progress = await getParticipantProgress(chalengeId);
        return progress
    }
);
export const compleeteProgressAction = createAsyncThunk(
    "chalenges/progress/compleete",
    async (id:string)=>{
          const progress= await compleeteProgress(id);
          return progress;
    }
);




const initialState :{
 chalenges:chalenge[],
 chalenge:chalenge | null,
 progress:chalengeProgress|null
 isLoading:boolean,
 error:string

}={
    chalenges:[],
    chalenge:null,
    progress:null,
    isLoading:false,
    error:''

}

const chalengesSlice = createSlice({
    name: 'chalenges',
    initialState,
    reducers:{
        updateRealTimechalenges:(state,action)=>{
            state.chalenges = state.chalenges.map((chalenge)=> chalenge._id == action.payload._id ? action.payload : chalenge )
        }
    },
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
        state.chalenges = state.chalenges.map((chalenge)=> chalenge._id ==action.payload._id? action.payload:chalenge )
        state.isLoading = false
       })
       .addCase(joinChalengeAction.rejected, (state)=>{
          state.error = "sdfghjk"
       })
       .addCase(createChalengeAction.pending, (state)=>{
        state.isLoading = true;
       })
       .addCase(createChalengeAction.fulfilled, (state,action)=>{
          state.chalenges.push(action.payload);
          state.isLoading = false;
         
       })
       .addCase(createChalengeAction.rejected, (state)=>{
        state.error = "gvjhbjklm";
        state.isLoading = false;

       })
       .addCase(updateChalengeActon.pending, (state)=>{
        state.isLoading = true;
       })
       .addCase(updateChalengeActon.fulfilled, (state,action)=>{
        state.chalenges = state.chalenges.map((chalenge)=> chalenge._id ==action.payload._id? action.payload:chalenge )
          state.isLoading = false;
         
       })
       .addCase(updateChalengeActon.rejected, (state)=>{
        state.error = "gvjhbjklm";
        state.isLoading = false;

       })

       .addCase(deleteChalengeAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteChalengeAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chalenges = state.chalenges.filter(
          (chalenge) => chalenge._id !== action.payload._id
        );
      })
      .addCase(deleteChalengeAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =  "Something went wrong";
      })
      .addCase(getParticipantProgressAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getParticipantProgressAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload
      })
      .addCase(getParticipantProgressAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =  "Something went wrong";
      })
      .addCase(compleeteProgressAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(compleeteProgressAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload
      })
      .addCase(compleeteProgressAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =  "Something went wrong";
      });

      
    }
});

export const {updateRealTimechalenges} = chalengesSlice.actions

export const chalengesReducer= chalengesSlice.reducer