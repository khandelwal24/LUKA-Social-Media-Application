import React, { useState } from 'react'
import LeftSidebar from './LeftSidebar'
import UseGetUserProfile from '../hooks/UseGetUserProfile'
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import store from '../Redux/Store';

import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

function Profile() {
  
  const Params = useParams();
  const userId = Params.id
  UseGetUserProfile(userId);

  const {userProfile,user} = useSelector(store=>store.auth);
  // console.log(userProfile);
  const isLoggedIn = (user?._id === userProfile?._id);
  const isFollowing = true;

  const [activeTab,setAvtiveTab] = useState('POST');
  const handletabChange = (TextType) => setAvtiveTab(TextType);
  
  let displayPost = (activeTab === 'POST') ? userProfile?.posts : (activeTab==='SAVED') ? userProfile?.bookmarks : null;
  // displayPost = (activeTab === 'SAVED') ? userProfile?.bookmarks : null



  return (
   <>
    
    <LeftSidebar/>
   

    <div className='max-w-[1400px] mx-auto my-8 flex flex-col justify-end px-5 mr-6 md:mr-0 sm:justify-center'>
    
    <div className='px-3 -mr-10 sm:-mr-0'>

    <div className='flex justify-center md:items-center items-start md:gap-20 gap-3 mb-5 ml-10 md:ml-0'>

    <img src={userProfile?.profilePic}  className='md:h-24 md:w-24 h-10 w-10  aspect-square rounded-full z-10' />

    <div>
    {/* // Lines 1 */}
        <div className='flex gap-2 items-center w-full'>
          
            <span>{userProfile?.username}</span>
            { isLoggedIn ? 
            <>
            <NavLink to={'/account/Edits'} className='bg-gray-300 hover:bg-gray-200 text-black text-center text-xs md:text-md p-1.5 rounded-md'>Edit Profile</NavLink>
            <button className='bg-gray-300 hover:bg-gray-200 text-black text-center text-xs md:text-md p-1.5 rounded-md'>View Archive</button>
            </>
            :
            (isFollowing) ? 
            <> 
            <button className='bg-gray-300 hover:bg-gray-200 text-black text-center text-xs md:text-md p-1.5 rounded-md'>Unfollow</button>
            <button className='bg-gray-300 hover:bg-gray-200 text-black text-center text-xs md:text-md p-1.5 rounded-md'>Messsage</button>
            </> : 
            <button className='bg-blue-500 hover:bg-blue-600 text-white text-center text-sm md:text-md p-1.5 rounded-md'>Follow</button>
            }
          
        </div>

        {/* Line 2 */}
        <div className='my-5 flex md:items-center text-sm md:text-md items-start md:gap-6 gap-2 flex-col md:flex-row '>
          <p> <span className='font-semibold'>posts</span>  {userProfile?.posts?.length}</p>
          <p> <span className='font-semibold'>Followers</span>  {userProfile?.followers?.length}</p>
          <p> <span className='font-semibold'>Following</span>  {userProfile?.following?.length}</p>
        </div>

        {/* Line 3 */}
        <div>
          <p className='md:text-md text-sm font-semibold'>{userProfile?.bio}</p>
        </div>
    </div>

    </div>
    </div>
  

      
    <hr className='text-black bg-black max-h-0.5 w-full my-3 ml-10'/>
    
    
    <div className='flex justify-center gap-5 w-full mb-3 ml-10 md:ml-0 text-center'>
        <span onClick={()=>handletabChange('POST')} className={`font-semibold hover:cursor-pointer text-lg ${activeTab==='POST' ? 'font-extrabold text-red-500':''}`}>POST</span>
        <span onClick={()=>handletabChange('SAVED')} className={`font-semibold hover:cursor-pointer text-lg ${activeTab==='SAVED' ? 'font-extrabold text-red-500':''}`}>SAVED</span>
        <span onClick={()=>handletabChange('REELS')} className={`font-semibold hover:cursor-pointer text-lg ${activeTab==='REELS' ? 'font-extrabold text-red-500':''}`}>REELS</span>
        <span onClick={()=>handletabChange('TAGS')} className={`font-semibold hover:cursor-pointer text-lg ${activeTab==='TAGS' ? 'font-extrabold text-red-500':''}`}>TAGS</span>
    </div>
  

    </div>

<div className='flex justify-items-center mx-auto justify-center ml-[18%]'>
<div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 '>
{displayPost?.map((v,i)=>{
  return(
    <div key={v?._id} className='relative group'>
    <img className='h-40 border rounded-2xl w-full hover:cursor-pointer p-2' src={v.image} alt='image'/>

<div className='absolute inset-0  rounded-2xl flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100'>
    <div className='flex items-center gap-3 group-hover:bg-opacity-25'>
     <span className='text-white flex items-center gap-2 text-lg font-semibold'>
     <FaHeart className='text-white'/> 
     <span>{v?.likes?.length} </span>
     </span> 
     <span className='text-white flex items-center gap-2 text-lg font-semibold'>
     <FaRegComment  className='text-white'/> 
     <span>{v?.comments?.length} </span>
     </span> 
     
    </div>
</div>

    </div>
  )
})}
</div>

</div>
    
   </>
  )
}

export default Profile
