import React, { useState } from 'react'
import { GoHomeFill } from "react-icons/go";
import { MdSearch } from "react-icons/md";
import { MdExplore } from "react-icons/md";
import { BsCameraReelsFill } from "react-icons/bs";
import { LuMessageSquare } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { IoPersonCircleSharp } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import logo from '/Logo.png'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../Redux/AuthSlice';
import CreatePostModal from './CreatePostModal';
import { setPosts, setSelectedPost } from '../Redux/PostSlice';

function LeftSidebar() {
    const navigate = useNavigate();
    const {user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();

    const SideBarData = [
        {
            icon:<GoHomeFill/>,
            text:'Home',
        },
        {
            icon:<MdSearch/>,
            text:'Search'
        },
        {
            icon:<MdExplore/>,
            text:'Explore'
        },
        {
            icon:<BsCameraReelsFill/>,
            text:'Reels'
        },
        {
            icon:<LuMessageSquare/>,
            text:'Messages'
        },
        {
            icon:<FaRegHeart/>,
            text:'Notification'
        },
        {
            icon:<MdOutlineLibraryAdd/>,
            text:'Create'
        },
        {
            icon:<img src={user?.profilePic} width={30} className='aspect-square rounded-full'/>,
            text:'Profile'
        },
        {
            icon:<TbLogout2/>,
            text:'Logout'
        },
    ]
    
   
    const logOutHandler = async()=>{

        try{
            const res = await axios.get('http://localhost:1000/api/v1/user/logout',{withCredentials:true})
            if(res.data?.success){
                toast.success(res.data?.message);
                setTimeout(()=>navigate('/Login'),1000);
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
            }
        }
        catch(error){
            console.log('Error Occured',error);
            toast.error(error.response.data?.message);
        }
    }

    
    const [openPostModal,setOpenPostModal] = useState(false);

    const clickHand = (textType)=>{
        if(textType ==='Logout') logOutHandler();
        else if (textType === 'Create') setOpenPostModal(true);
        else if (textType === 'Profile') navigate(`/profile/${user._id}`)
        else if (textType === 'Home') navigate(`/`)
        else if (textType === 'Messages') navigate(`/chats`)
    }

  return (
    <div className='h-screen top-0 fixed z-10 sm:w-[20%] bg-gray-300 border-r border-black shadow-xl px-2 mr-3 '>
    
    <div className='flex items-center text-center mx-auto'>
    <img src={logo} width={50}/>
    <span className='font-bold text-3xl text-center my-3 px-3 hidden md:block'>LUKA</span> 
    </div>

      {SideBarData.map((v,i)=>{
       return(
        <div onClick={()=>clickHand(v.text)} key={i} className='flex items-center gap-3 p-3 my-3 relative cursor-pointer rounded-lg hover:bg-gray-200'>
        <span className='text-2xl'>{v.icon}</span>
        <span className='hidden md:block'>{v.text}</span>
        </div>
       )
      })}
      <CreatePostModal openPostModal={openPostModal} setOpenPostModal={setOpenPostModal} closemodal={()=>setOpenPostModal(false)}/>
    </div>
  )
}

export default LeftSidebar
