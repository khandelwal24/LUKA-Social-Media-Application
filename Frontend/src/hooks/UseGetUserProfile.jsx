
import axios from 'axios';
import React from 'react'
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setSuggestedUser, setuserProfile } from '../Redux/AuthSlice';


const UseGetUserProfile = (userId) => {
    const dispatch = useDispatch();

    useEffect( () => {
        const fetchUserProfile = async () =>{
            try{
                const res = await axios.get(`https://luka-social-media-application-1.onrender.com/api/v1/user/${userId}/profile`, {withCredentials:true})
                if(res.data.success){
                    // console.log('Custom hook ka data',res.data);
                    dispatch(setuserProfile(res.data?.user))
                }
            }
            catch(error){
                console.log('Error occured',error);
            }
        }

        fetchUserProfile();

    },[userId])
}

export default UseGetUserProfile



 
    
    






