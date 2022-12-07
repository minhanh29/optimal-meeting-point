import { applyMiddleware, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducer from './reducers/userSlice';

export const store = configureStore({
    reducer:{
        user: userReducer,
    },
})
