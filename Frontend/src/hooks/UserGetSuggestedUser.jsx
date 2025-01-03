import axios from 'axios';
import React from 'react'
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setSuggestedUser } from '../Redux/AuthSlice';

const UserGetSuggestedUser = () => {
    const dispatch = useDispatch();
    
    useEffect( () => {
        const fetchSuggestedUser = async () =>{
            try{
                const res = await axios.get('https://luka-social-media-application.onrender.com/api/v1/user/Suggested_Users', {withCredentials:true})
                if(res.data.success){
                    // console.log('Custom hook ka data',res.data);
                    dispatch(setSuggestedUser(res.data?.users))
                }
            }
            catch(error){
                console.log('Error occured',error);
            }
        }

        fetchSuggestedUser();

    },[])

}

export default UserGetSuggestedUser


