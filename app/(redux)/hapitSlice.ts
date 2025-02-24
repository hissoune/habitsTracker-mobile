import { Habit } from '@/constants/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createHabit, getAllHabits, getHabitById } from '../(services)/apis/hapitApi';


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

const initialState:{
    habits:Habit[],
    habit:Habit|null,
    isLoading:boolean,
    error:string| null
    
}={
    habits:[],
    habit:null,
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
        })
        
    }
    
});

export const habitReducer = habitSlice.reducer

