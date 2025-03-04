import { Habit, progress } from '@/constants/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createHabit, getAllHabits, getHabitById, reactiveHabit } from '../(services)/apis/hapitApi';
import { getProgress, completProgress } from '../(services)/apis/progress.api';


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
    reducers:{
        updateScheduledHabits:(state,action)=>{
            if (action.payload.habit) {
             state.habit = action.payload.habit;
             state.habits = state.habits.map((habit)=>
                habit._id == action.payload.habit._id ?action.payload.habit:habit
             )
            }
            if (action.payload.progress ) {
                state.progress = action.payload.progress;

            }
            if (action.payload.progress.progressStatus == 'expired') {
                state.progress = null;
            }
             
        }
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
        
    }
    
});
export  const {updateScheduledHabits} = habitSlice.actions
export const habitReducer = habitSlice.reducer

