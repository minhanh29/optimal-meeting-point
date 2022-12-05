import {configureStore} from '@reduxjs/toolkit';
import { useReducer } from './reducers/userSlice';

export const store = configureStore({
    reducer:{
        user: useReducer
    },
})