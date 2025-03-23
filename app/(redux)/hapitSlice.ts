import { Habit, progress } from '@/constants/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createHabit, deleteHabit, getAllHabits, getHabitById, reactiveHabit, updateHabit } from '../(services)/apis/hapitApi';
import { getProgress, completProgress } from '../(services)/apis/progress.api';
import { Frequency } from '../../constants/types';


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

export const reactiveHabitAction =createAsyncThunk(
    "habits/reactive",
    async (habitId:string)=>{
      const habit = await reactiveHabit(habitId);         
      return habit;
    }
);
export const completProgressAction=createAsyncThunk(
    "habits/complet",
    async (progressId:string)=>{
        const progress = await completProgress(progressId);
        return progress;
    }
);

export const deleteHabitAction = createAsyncThunk(
    "habits/delete",
    async (habitId:string)=>{
        const deletedHabit = await deleteHabit(habitId)
        return deletedHabit
    }
);

export const updateHabitAction =createAsyncThunk(
    "habits/update",
    async ({ habitId, habit }: { habitId: string; habit: Partial<Habit> }) => {
     const  constUpdatedHabit = await updateHabit(habitId, habit);
     return constUpdatedHabit
    }
);

const initialState:{
    habits:Habit[],
    habit:Habit|null,
    progress:progress|null
    isLoading:boolean,
    createOrUbdateLoading:boolean
    error:string| null
    
}={
    habits:[],
    habit:null,
    progress:null,
    isLoading:false,
    createOrUbdateLoading:false,
    error:null
}

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers:{
        updateScheduledHabits:(state,action)=>{ 
                state.habits = state.habits.map((habit)=>
                habit._id == action.payload.habit._id ?action.payload.habit:habit
             )  
        },
       
    },
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
            state.createOrUbdateLoading =true
        })
        .addCase(createHabitAction.fulfilled, (state,action)=>{
            state.habits.push(action.payload)
            state.createOrUbdateLoading =false
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
            state.isLoading =false
        })
        .addCase(getProgressAction.fulfilled, (state,action)=>{
            state.progress = action.payload
            state.isLoading =false
        })
        .addCase(getProgressAction.rejected, (state)=>{
            state.progress =null
            state.error = 'fzancjk'
        })
        .addCase(reactiveHabitAction.pending, (state)=>{
            state.isLoading =true
        })
        .addCase(reactiveHabitAction.fulfilled, (state,action)=>{
            state.habit = action.payload
            state.isLoading =false
        })
        .addCase(reactiveHabitAction.rejected, (state)=>{
            state.error = 'fzancjk'
            state.isLoading =false

        })
        .addCase(completProgressAction.pending, (state)=>{
            state.isLoading =true
        })
        .addCase(completProgressAction.fulfilled, (state,action)=>{
            state.progress = action.payload
            state.isLoading =false
        })
        .addCase(completProgressAction.rejected, (state)=>{
            state.error = 'fzancjk'
            state.isLoading =false

        })
        .addCase(deleteHabitAction.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(deleteHabitAction.fulfilled, (state,action)=>{
            state.habits = state.habits.filter((habit)=> habit._id != action.payload._id);
            state.isLoading = false

        })
        .addCase(deleteHabitAction.rejected, (state)=>{
            state.isLoading = false
            state.error = 'no dont '
        })
        .addCase(updateHabitAction.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(updateHabitAction.fulfilled, (state,action)=>{
            state.habits = state.habits.map((habit)=> habit._id == action.payload._id?action.payload:habit);
            state.isLoading = false

        })
        .addCase(updateHabitAction.rejected, (state)=>{
            state.isLoading = false
            state.error = 'no dont '
        })
        
    }
    
});
export  const {updateScheduledHabits} = habitSlice.actions
export const habitReducer = habitSlice.reducer

