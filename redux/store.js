import {configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/userSlice';
import groupReducer from './reducers/groupSlice'

export const store = configureStore({
    reducer:{
        user: userReducer,
        group: groupReducer,
    },
})
