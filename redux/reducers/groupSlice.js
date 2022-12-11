
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
} from "../../firebaseConfig"


export const GROUP_IDLE = 0
export const GROUP_CREATE_PENDING = 1
export const GROUP_CREATE_REJECTED = 2
export const GROUP_CREATE_SUCCESS = 3   
export const GROUP_AND_USER_IDLE = 4
export const GROUP_AND_USER_PENDING = 5
export const GROUP_AND_USER_REJECTED = 6
export const GROUP_AND_USER_SUCCESS = 7
export const GROUP_DELETE_PENDING = 8
export const GROUP_DELETE_REJECTED = 9
export const GROUP_DELETE_SUCCESS = 10   


const initialState = {
    groups: [],
    groupInfo: {
        group_id: "",
        group_name: "",
        location: "",
    },
	status: GROUP_IDLE,
    groupNuserStatus: GROUP_AND_USER_IDLE,
}




export const createGroupAsync = createAsyncThunk('group/createGroupAsync', async(data) => {
    	const res = await createGroup({group_name: data.group_name, location: data.location})
        console.log("Data",data)
        const res2 = await createGroupandUser({group_address: "", group_id: res.id, role:"host", user_id: data.user_id})
        console.log("RES2",res2)
    	return {
    		id: res.id,
    		...data
    	}
})

export const deleteGroupAsync = createAsyncThunk('group?createGroupAsync', async(data) => {
    await deleteGroup(data)
    return data
})



const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers:{
        changeGroupStatus: (state, action) => {
            state.status = action.payload
        },
        
    },
    extraReducers: builder =>{
        builder
        .addCase(createGroupAsync.pending, state =>{
            state.status = GROUP_CREATE_PENDING
        })
        .addCase(createGroupAsync.fulfilled, (state,action) => {
            state.status = GROUP_CREATE_SUCCESS
            state.groupInfo = action.payload
        })
        .addCase(createGroupAsync.rejected, (state, action) => {
            state.status = GROUP_CREATE_REJECTED
            console.log("ACTION",action)
        })
        .addCase(deleteGroupAsync.rejected, (state, action) => {
            state.status = GROUP_DELETE_REJECTED
            console.log("ACTION", action)
        })
        .addCase(deleteGroupAsync.pending, (state, action) => {
            state.status = GROUP_DELETE_PENDING
        })
        .addCase(deleteGroupAsync.fulfilled, (state, action) => {
            const id = action.payload
            // const index = state.lecturers.findIndex(lec => lec.id === id)
            // state.lecturers.splice(index, 1)
            state.status = GROUP_DELETE_SUCCESS
        })
    }
})

export const selectGroup = (state) => state.group
export const {changeGroupStatus} = groupSlice.actions

export default groupSlice.reducer

