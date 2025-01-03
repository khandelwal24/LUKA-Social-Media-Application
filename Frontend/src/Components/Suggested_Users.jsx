import React from 'react'
import { useSelector } from 'react-redux'
import store from '../Redux/Store'
import { Link } from 'react-router-dom';


const Suggested_Users = () => {
    const {user,SuggestedUser} = useSelector(store=>store.auth);

  return (
    <div>
    <div className=' w-full'>
    
    <Link to={`/profile/${user?._id}`}>
    <div className='flex items-center justify-start gap-2'>
    <img src={user?.profilePic} width={30} className='h-8 aspect-square rounded-full'/>
    <span className='flex flex-col gap-1'> {user?.username} <span className='text-xs text-gray-500 font-serif'>{user?.bio}</span> </span>
    </div>
    </Link>

<div className='my-5 flex justify-between items-center gap-10'>
    <p className='text-blue-500 text-md  font-semibold'>Suggested Users for You</p>
    <span className='text-black text-sm fonnt-bold cursor-pointer'>See All</span>
</div>


{
SuggestedUser?.map((v,i)=>{
return(
    <div key={v._id}>
    <Link to={`/profile/${v?._id}`}>
    <div className='flex items-center justify-start gap-2'>
    <img src={v?.profilePic} width={30} className='h-8 aspect-square rounded-full'/>
    <span className='flex flex-col gap-1'> {v?.username} <span className='text-xs text-gray-500 font-serif'>{v?.bio}</span> </span>
    </div>
    </Link>
    </div>
)
})

},
</div>
</div>
  )
}

export default Suggested_Users