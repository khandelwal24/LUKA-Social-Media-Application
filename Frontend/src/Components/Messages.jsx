import React, { useRef,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import UseGetAllMessages from '../hooks/UseGetAllMessages.jsx';
import UseGetRTM from '../hooks/UseGetRTM.jsx';

const Messages = ({SelectedUser}) => {
   UseGetAllMessages();
   UseGetRTM();
   const {user} = useSelector(store=>store.auth);
   const {Msgs} = useSelector(store=>store.chatio);
   console.log("Messages wala Message : ",Msgs);
  //  if(!Msgs) return console.log('Not messages Found b/w particaipants');
   
    // console.log('Message from Message Page : ',messages);



   const msgRef = useRef();
    useEffect(()=>{
        msgRef.current?.scrollIntoView({behaviour:'smooth'});
    },[Msgs])


  return (
    <div className='overflow-y-auto p-1.5 '>
   
    <div className='flex justify-center px-5'>
    <div className='flex flex-col items-center'>
        <img src={SelectedUser?.profilePic} className='h-14 w-14 rounded-full'/>
        <p>{SelectedUser?.username}</p>
        <p className='text-gray-500 text-sm text-center'>{SelectedUser?.bio}</p>
        <NavLink className={`rounded-md border p-1.5 text-sm my-1 bg-blue-500 hover:bg-blue-600 text-white`} to={`/profile/${SelectedUser._id}`}>View Profile</NavLink>
    </div>
    </div>


    

    {
      Msgs?.map((v,i)=>{
        return(
          <div ref={msgRef} className={`p-2 flex gap-1 ${v?.senderId === user?._id ? 'justify-end':'justify-start'}`}>
          <img className={`h-5 w-5 rounded-full ${v?.senderId === user?._id ? 'order-1':'order-2'}`} src={v?.senderId === user?._id ? user?.profilePic : SelectedUser?.profilePic } />
          <p className={`p-1.5 break-words md:max-w-[20%] max-w-[35%] rounded-md  text-xs ${v?.senderId === user?._id ?'bg-blue-500 text-white' : 'bg-gray-300 text-black order-2'}`}>{v.message}</p>
          {/* {v.message} */}
          </div>
        )
      })
    }


    </div>
  )
}

export default Messages
