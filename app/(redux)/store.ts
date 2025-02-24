import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './aithSlice';
import { habitReducer } from './hapitSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        habit:habitReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;