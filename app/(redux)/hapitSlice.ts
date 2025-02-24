import { Habit, progress } from '@/constants/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createHabit, getAllHabits, getHabitById } from '../(services)/apis/hapitApi';
import { getProgress } from '../(services)/apis/progress.api';


export const getAllHabitsAction =createAsyncThunk(
    "habits/all",
    async ()=>{
     const habits = await getAllHabits();
     return habits
    }
);
export const createHabitAction =createAsyncThunk(
    "habits/create",
    async (habit:Habit)=>{
        const habitCreated = await createHabit(habit);
        return habitCreated

    }
);

export const getHabitByIdAction = createAsyncThunk(
    "habits/habit",
    async (habitId:string)=>{
        
        
       const habit = await getHabitById(habitId);
       
       return habit
    }
);

export const getProgressAction=createAsyncThunk(
    "habits/progress",
    async (habitId:string)=>{
       const progress = await getProgress(habitId);
       return progress;
    }
);

const initialState:{
    habits:Habit[],
    habit:Habit|null,
    progress:progress|null
    isLoading:boolean,
    error:string| null
    
}={
    habits:[],
    habit:null,
    progress:null,
    isLoading:false,
    error:null
}

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getAllHabitsAction.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getAllHabitsAction.fulfilled, (state,action)=>{
            state.habits = action.payload
            state.isLoading = false
        })
        .addCase(getAllHabitsAction.rejected, (state)=>{
            state.error = 'there is a err'
            state.isLoading = false

        })
        .addCase(createHabitAction.pending, (state)=>{
            state.isLoading =true
        })
        .addCase(createHabitAction.fulfilled, (state,action)=>{
            state.habits.push(action.payload)
            state.isLoading =false
        })
        .addCase(createHabitAction.rejected, (state)=>{
            state.error = 'fzancjk'
        })
        .addCase(getHabitByIdAction.pending, (state)=>{
            state.isLoading =true
        })
        .addCase(getHabitByIdAction.fulfilled, (state,action)=>{
            state.habit = action.payload
            state.isLoading =false
        })
        .addCase(getHabitByIdAction.rejected, (state)=>{
            state.error = 'fzancjk'
            state.isLoading =false

        })
        .addCase(getProgressAction.pending, (state)=>{
            state.isLoading =true
        })
        .addCase(getProgressAction.fulfilled, (state,action)=>{
            state.progress = action.payload
            state.isLoading =false
        })
        .addCase(getProgressAction.rejected, (state)=>{
            state.error = 'fzancjk'
        })
        
    }
    
});

export const habitReducer = habitSlice.reducer

