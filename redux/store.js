import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducer from './reducers/userSlice';

const middlewares = [thunk]

export const store = configureStore({
    reducer:{
        user: userReducer,
    },
}, applyMiddleware(...middlewares))
