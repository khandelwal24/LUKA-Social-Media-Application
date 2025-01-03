import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chatio",
    initialState:{
        onlineUsers:[],
        Msgs:[],
    },
    reducers:{
        setOnlineUsers:(state,action) =>{
            state.onlineUsers = action.payload
        },
        setMsgs:(state,action)=>{
            state.Msgs = action.payload
        }
    }
})

export const {setOnlineUsers, setMsgs} = chatSlice.actions;
export default chatSlice.reducer;