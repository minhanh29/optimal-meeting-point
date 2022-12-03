import { firebase } from "@react-native-firebase/firestore";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
	auth,
	createUserWithEmailAndPassword,
	createUser,
	signOut,
} from "../../firebase"

export const USER_IDLE = 0
export const USER_SIGNUP_SUCCESS = 1
export const USER_SIGNUP_FAILED = 2
export const USER_SIGNUP_PENDING = 3

const initialState = {
    user: {
        id: "",
        name: "",
        username: "",
        avaUrl: "",
        address: new firebase.firestore.GeoPoint(10.729567, 106.6930756),
        adress_text: "702 Nguyen Van Linh Street, Tan Phong Ward, District 7, Ho Chi Minh City",
        gps_enabled: true,
    },
    signUpStatus: USER_IDLE,
}

export const signUpAsync = createAsyncThunk('user/signUpAsync', async (data)=>{
    // create an account on firebase auth
    const res = await createUserWithEmailAndPassword(auth, data.username, data.password)

    //save to Firestore
    await createUser(res.user.uid, data.name, data.username)

    await signOut(auth)

})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        changeSignUpStatus: (state,action) => {
			state.signUpStatus = action.payload
		},
        signUpFail: (state, action) => {
			state.signUpStatus = USER_SIGNUP_FAILED
		},
    },
    extraReducers: builder =>{
        builder.addCase(signUpAsync.pending, state =>{
            state.signUpStatus = USER_SIGNUP_PENDING
        }),
        builder.addCase(signUpAsync.fulfilled, state => {
            state.signUpStatus = USER_SIGNUP_SUCCESS
        }),
        builder.addCase(signUpAsync.rejected, state => {
            state.signUpStatus = USER_SIGNUP_FAILED
        })
    }
})

export const selectUser = (state) => state.user
export const {changeSignUpStatus, signUpFail} = userSlice.actions

export default userSlice.reducer