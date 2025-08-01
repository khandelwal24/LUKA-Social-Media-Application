import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { createAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { setMsgs } from '../Redux/ChatSlice.jsx';

const UseGetAllMessages = () => {

  const {SelectedUser,user} = useSelector(store=>store.auth);
  const dispatch = useDispatch();
    
        useEffect(()=>{
          const fetchAllMessages = async() => {
              try{
                  const res = await axios.get(`http://localhost:1000/api/v1/messages/all/${SelectedUser?._id}`,{headers:{"Content-Type":'application/json'},withCredentials:true});
                  if(res.data.success){
                    toast.success(res.data.message);
                    dispatch(setMsgs(res.data.convo));
                  }
              }
              catch(error){
                  toast.error(error.response.data.message);
                  console.log('Error Occured',error);
                  dispatch(setMsgs(null));
              }
          }
          
          fetchAllMessages();
      
        },[SelectedUser])
      }
    

export default UseGetAllMessages
