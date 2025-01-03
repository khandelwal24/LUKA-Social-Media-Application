import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        SuggestedUser:[],
        userProfile:null,
        SelectedUser:null,
    },
    reducers:{
        //actions..
        setAuthUser:(state,action)=>{
            state.user = action.payload
        },
        setSuggestedUser:(state,action)=>{
            state.SuggestedUser = action.payload
        },
        setuserProfile:(state,action)=>{
            state.userProfile = action.payload
        },
        setSelectedUser:(state,action)=>{
            state.SelectedUser = action.payload
        },
    }
});

export const {setAuthUser,setSuggestedUser,setuserProfile,setSelectedUser} = authSlice.actions;
export default authSlice.reducer;