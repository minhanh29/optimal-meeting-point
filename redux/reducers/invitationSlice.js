
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { GeoPoint } from "firebase/firestore";
import { geoToDict } from "../../components/common/Utils";
import {
	auth,
	createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
	createUser,
	signOut,
    getUserInfo,
    createGroup,
    createGroupandUser,
    deleteGroup,
    createInvitation,
} from "../../firebaseConfig"


export const INVITATION_IDLE = 0
export const INVITATION_CREATE_PENDING = 1
export const INVITATION_CREATE_SUCCESS = 2
export const INVITATION_CREATE_FAIL = 3


const initialState = {
    // invitationInfo: {
    //     group_id: "",
    //     sender_id: "",
    //     receiver_id: "",
    //     status: 0,
    //     created_at: new Date(),
    // },
    invitations: [],
	status: INVITATION_IDLE,
}


export const createInvitaionAsync = createAsyncThunk('invitaion/createInvitation', async (data) => {
    const res = await createInvitation(data)
    return {
        id: res.id,
        ...data
    }
})






const invitationSlice = createSlice({
    name: 'invitation',
    initialState,
    reducers:{
        changeGroupStatus: (state, action) => {
            state.status = action.payload
        },
        
    },
    extraReducers: builder =>{
        builder
        .addCase(createInvitaionAsync.pending, state =>{
            state.status = INVITATION_CREATE_PENDING
        })
        .addCase(createInvitaionAsync.fulfilled, (state,action) => {
            state.status = INVITATION_CREATE_SUCCESS
            // state.groupInfo = action.payload
        })
        .addCase(createInvitaionAsync.rejected, (state, action) => {
            state.status = INVITATION_CREATE_REJECTED
            console.log("ACTION",action)
        })
    
    }
})

export const selectInvitation = (state) => state.invitation
export const {changeGroupStatus} = invitationSlice.actions

export default invitationSlice.reducer

