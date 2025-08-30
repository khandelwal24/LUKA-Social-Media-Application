import React, { useEffect, useState } from 'react'
import LeftSidebar from './LeftSidebar'
import { useDispatch, useSelector } from 'react-redux'
import store from '../Redux/Store'
import { setSelectedUser } from '../Redux/AuthSlice';
import Messages from './Messages.jsx';
import axios from 'axios';
import UseGetAllMessages from '../hooks/UseGetAllMessages.jsx';
import { toast,ToastContainer } from 'react-toastify';
import { setMsgs } from '../Redux/ChatSlice.jsx';

function ChatPage() {
    const [textMessage,settextMessage] = useState('');

    const {user,SuggestedUser,SelectedUser} = useSelector(store=>store.auth);
    const {onlineUsers, Msgs} = useSelector(store=>store.chatio);
  
   
    // console.log('ChatPage Wala Messages : ',messages);
    // console.log("ChatPage Wala Online User : ",onlineUsers);
    // console.log('ChatPage Wala Selected User :',SelectedUser?._id);

    const dispatch = useDispatch();

    const [text,setText] = useState('');
    
    const textHandler = (e) =>{
        const inputText = e.target.value;
        if(inputText.trim()) setText(inputText);
        else setText("");
    }

    const sendMessageHandler = async() => {
        try{
            const res = await axios.post(`https://luka-social-media-application-1.onrender.com/api/v1/messages/send/${SelectedUser?._id}`,{textMessage},{headers:{"Content-Type":'application/json'},withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
                dispatch(setMsgs([...Msgs, res.data.newMessage]))
                settextMessage('');
            }
        }
        catch(error){
            console.log('Error Occured hua hai Bro',error);
            // dispatch(setMsgs(null));
        }
    }

    useEffect(()=>{
        //clean up kardo selected users ko..
        return () =>{
            dispatch(setSelectedUser(null));
        }
    },[user]);


  return (
    <>
    <ToastContainer theme='dark' autoClose={1000} position='top-center' />

    <LeftSidebar/>

        
    <div className='md:ml-[20%] ml-[16%]'>
     <div className='grid grid-cols-[25%_auto]'>

     <section className='px-1.5 border-r-2 py-2 mt-[12px]'>
        
        
        <h1 className='font-bold mb-3 md:text-xl text-sm overflow-hidden text-left px-1.5'>{user?.username}</h1>
        <hr className='h-0 w-full mt-2'></hr>
      
        <div className='overflow-y-auto space-y-3 h-[100vh]'>
{
    SuggestedUser?.map((v)=>{
        const isOnline = onlineUsers?.includes(v._id);
        return(
            <div key={v._id} onClick={()=>dispatch(setSelectedUser(v))} className='flex justify-start md:gap-2 gap-0 items-center p-1.5 rounded-md hover:bg-gray-50 hover:cursor-pointer'>
                <img src={v?.profilePic} className='h-10 w-10 mx-auto md:mx-0 rounded-full'/>
                <p className='flex flex-col'>
                <span className='font-semibold hidden md:block'>{v?.username}</span>
                <span className={`text-xs hidden md:block font-bold ${isOnline ? 'text-green-600' : 'text-red-500'}`}>{isOnline ? 'Online':'Offline'}</span>
                </p>
            </div>
        )
    })
}
        </div>

        </section>

        <section>

        {
        SelectedUser ? 


        <section className='flex-1 h-screen flex flex-col hover:bg-gray-100 fixed w-[60vw]'>

           
            <div className='flex items-center gap-2 z-10 p-1.5 border-b my-2 top-0 sticky'>
            <img className='h-10 w-10 rounded-full' src={SelectedUser?.profilePic}/>
            <div className='flex flex-col items-start justify-center gap-1'>
            <span>{SelectedUser?.username}</span>
            <span className={`text-xs ${onlineUsers?.includes(SelectedUser?._id) ? 'text-green-600':'text-red-500'}`}>{onlineUsers?.includes(SelectedUser?._id) ? 'Online' : 'Offline'}</span>
            </div>
            </div>
           
           
           <div className='overflow-y-auto mb-10'>
            <Messages SelectedUser={SelectedUser}/>
           </div>


           <div className='flex absolute md:bottom-0 bottom-2 w-full'>
            <input value={textMessage} onChange={(e)=>settextMessage(e.target.value)} type='text' placeholder='Enter your messages...' className='p-2.5 text-sm outline-none w-full'></input>
            <button onClick={sendMessageHandler} className='text-sm text-center bg-blue-500 text-white font-semibold hover:bg-blue-600  p-1.5'>Send</button>
           </div>

           
        </section> 

        :

        <section className='flex-1 h-screen w-[60vw] fixed justify-center items-center flex flex-col hover:bg-gray-100'>

            <div className='flex flex-col text-center'>
            <p className='font-semibold text-xl'>Your Messages</p>
            <p className='text-sm font-thin'>Send a message to start a chat</p>
            </div>

            </section>
            
      }


        </section>


     </div>
    </div>

</>
  )
}

export default ChatPage
