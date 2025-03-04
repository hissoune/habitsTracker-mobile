import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './aithSlice';
import { habitReducer } from './hapitSlice';
import { chalengesReducer } from './chalengesSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        habit:habitReducer,
        chalenge:chalengesReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;