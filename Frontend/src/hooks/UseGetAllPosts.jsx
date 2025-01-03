import axios from 'axios';
import React from 'react'
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setPosts } from '../Redux/PostSlice';


const UseGetAllPosts = () => {
   
    const dispatch = useDispatch();
   
    useEffect( () => {
        const fetchAllposts = async () =>{
            try{
                const res = await axios.get('https://luka-social-media-application.onrender.com/api/v1/posts/all', {withCredentials:true})
                if(res.data.success){
                    // console.log('Custom hook ka data',res.data);
                    dispatch(setPosts(res.data?.posts))
                }
            }
            catch(error){
                console.log('Error occured',error);
            }
        }
        
        fetchAllposts();

    },[])

}

export default UseGetAllPosts
