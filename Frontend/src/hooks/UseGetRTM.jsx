import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import store from '../Redux/Store';
import { combineSlices } from '@reduxjs/toolkit';
import { setMsgs } from '../Redux/ChatSlice.jsx';

const UseGetRTM = () => {
    const dispatch = useDispatch();
    const {socket} = useSelector(store=>store.socketio);
    const {Msgs} = useSelector(store=>store.chatio);

    useEffect(()=>{
        socket?.on('newMessage',(newMessage)=>{
            // console.log('Babu',newMessage);
            dispatch(setMsgs([...Msgs, newMessage]));
        })

        return()=>{
            socket?.off('newMessage');
        }
    },[Msgs,setMsgs]);

}

export default UseGetRTM
