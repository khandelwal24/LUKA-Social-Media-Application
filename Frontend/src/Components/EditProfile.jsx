import React, { useRef, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import { useDispatch, useSelector } from 'react-redux'
import store from '../Redux/Store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { setAuthUser, setuserProfile } from '../Redux/AuthSlice'

const EditProfile = () => {
    const {user} = useSelector(store=>store.auth);
    const imgRef = useRef();
    const [loader,setloader] = useState(false);

    const [info,setInfo] = useState({
        profilePic: user?.profilePic,
        bio:user?.bio,
        gender:user?.gender,
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const fileChangeHandler = (e) =>{
        const file = e.target.files?.[0];
        if(file) setInfo({...info,profilePic:file});
    }
    const selectChangeHandler = (value) =>{
        setInfo({...info,gender:value})
    }

    const HandleSubmit = async (e) =>{
        // console.log(info);
        const formdata = new FormData();
        formdata.append("bio",info?.bio);
        formdata.append("gender",info?.gender);
        if(info?.profilePic) formdata.append("profilePic",info?.profilePic);

        try{
            setloader(true);
            const res = await axios.post('http://localhost:1000/api/v1/user/profile/edits',formdata,{headers:{"Content-Type":'multipart/form-data'},withCredentials:true});
            if(res.data.success){
                const updateProfileData = {
                    ...user,
                    bio:res.data.user.bio,
                    profilePic:res.data.user.profilePic,
                    gender:res.data.user.gender
                }
                dispatch(setuserProfile(updateProfileData));
                dispatch(setAuthUser(updateProfileData));
                navigate(`/profile/${user._id}`);
                toast.success(res.data.message);
            }

        }
        catch(error){
            console.log('Error Occured',error);
            toast.error(error.response.data.message);
        }
        finally{
            setloader(false);
        }
    }

  return (
    <>
      <LeftSidebar/>
<ToastContainer/>
     <div className='flex max-w-2xl mx-auto pl-[5%] my-8 px-4'>
     <section className='flex flex-col w-full gap-6 ml-[20%] md:ml-[0%]'>
        
        <h1 className='text-2xl font-semibold'>Edit Profile</h1>
        
        <div className='items-center justify-between flex gap-4 p-2.5 bg-gray-200 rounded-md'>
        
        <div className='flex items-center gap-2'>
            <img className='h-16 w-16 rounded-full' src={user?.profilePic}/>
            <span className='flex flex-col gap-1'>
                <p>{user?.username}</p>
                <p>{user?.bio}</p>
            </span>
        </div>

        <div>
        <input onChange={fileChangeHandler} type='file' ref={imgRef} className='hidden'/>
        <button onClick={()=>imgRef.current.click()} className='text-xs font-bold bg-blue-500 rounded-md text-white hover:bg-blue-600 p-1.5'>Change Photo</button>
        </div>

        </div>

{/* /// BIO part */}
    <div>
        <h1 className='text-lg font-semibold'>Bio</h1>
        <textarea value={info.bio} onChange={(e)=>setInfo({...info,bio:e.target.value})} placeholder='Enter bio here....'  maxLength={200} className='w-full p-1.5 rounded-md outline-none border'/>
    </div>

    {/* Gender div */}
    <div>
        <h1 className='text-lg font-semibold'>Gender</h1>
        <select className='w-full' value={info.gender} onChange={(e)=>{selectChangeHandler(e.target.value)}}>
            <option>Male</option>
            <option>Female</option>
        </select>
    </div>

    {/* Button */}
    <div className='flex justify-end'>
    {loader ? 
    <button className='bg-blue-500 hover:bg-blue-600 rounded-md text-white p-1.5 text-md'>Please wait...</button> 
        :
    <button onClick={HandleSubmit} className='bg-blue-500 hover:bg-blue-600 rounded-md text-white p-1.5 text-md'>Submit</button>
        }
    </div>
     </section>

        
     </div>
    </>
  )
}

export default EditProfile
