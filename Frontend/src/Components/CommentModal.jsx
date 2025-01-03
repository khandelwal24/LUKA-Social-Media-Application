import React, { useRef, useState, useEffect } from 'react'
import { IoMdClose } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
// import logo from '../assets/logo.png'
import DoubleCommentModal from './DoubleCommentModal';
import { useDispatch, useSelector } from 'react-redux';
import store from '../Redux/Store';
import Comment from './Comment.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { setPosts } from '../Redux/PostSlice.jsx';

function CommentModal({closeModal,post}) {
    const modalRef = useRef();
    const closePop = (e) =>{
        if(modalRef.current === e.target) closeModal();
    }

    const[doublemodal,setdoublemodal] = useState(false);
    
    const [text,setText] = useState("");
    const changeEventHandler = (e) =>{
        const inputText = e.target.value;
        if(inputText.trim()) setText(inputText);
        else setText("");
    }

    const {selectedPost,posts} = useSelector(store=>store.post);
    const [newCommet,setNewComment] = useState([]);
    const dispatch = useDispatch();
    
   
    const commentHandler = async () =>{
        try{
         const res = await axios.post(`https://luka-social-media-application.onrender.com/api/v1/posts/${selectedPost._id}/comment`,{text},{headers:{"Content-Type":'application/json'},withCredentials:true});
         if(res.data.success){
          toast.success(res.data.message);
          const updateCommentData = [...newCommet,res.data.comment]
          setNewComment(updateCommentData);
          const updatedPostdata = await posts.map((v)=> v._id===post._id ? {...v, newCommet:updateCommentData}:v);
          dispatch(setPosts(updatedPostdata));
          setText('');
         }
        }
        catch(error){
          console.log('Error occured',error);
          toast.error(error.response.data.message);
        }
      }

      useEffect(()=>{
        if(selectedPost.comments) setNewComment(selectedPost.comments);
    },[selectedPost,newCommet,setNewComment])



      const containRef = useRef(null);
      useEffect(()=>{
          containRef.current.scrollTop = containRef.current.scrollHeight
      },[newCommet])
      



  return (
    <div ref={modalRef} onClick={closePop} className='fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-30 flex items-center justify-center'>
      <div className='ml-16 sm:ml-0'>

<ToastContainer/>
            <button onClick={closeModal}><IoMdClose className='text-2xl text-black'/></button>


            <div className='bg-gray-200 rounded-md p-2.5 mx-auto md:max-w-[600px] md:max-h-[400px] flex justify-around gap-2 sm:flex-row flex-col'>
                
             
                    <img width={300} src={post?.image}/>
                    
                    <div className='flex flex-col justify-start w-full'>
                   
                   <div className='flex justify-between items-center'>
                    
                    <div className='flex items-center gap-2 my-3'>
                        <img className='bg-black rounded-full aspect-square' width={30} src={post.author?.profilePic}/>
                        <span>{post.author?.username}</span>
                    </div>

                    <button onClick={()=>setdoublemodal(true)}> <BsThreeDots className='text-2xl text-black'/></button>

                   </div>

                    <hr className='w-full mb-2 h-[2px] text-red-500 bg-gray-400'/>

                    <div id='KK' ref={containRef} className='flex-1 overflow-y-scroll h-[400px]'>
                    {
                        newCommet.map((comm)=><Comment key={comm._id} comm={comm} />)
                    }
                    </div>

                    <div className='flex justify-between items-center w-full my-1'>
                        <input value={text} type='text' onChange={changeEventHandler} className=' break-words bg-transparent outline-none p-1.5' placeholder='Add comment...'/>
                        {text && <button onClick={()=>{setText(''); commentHandler; console.log(text)}} className='text-[#3BADF8]'>Post</button> }
                    </div>
                  
                    {doublemodal && <DoubleCommentModal closemode={()=>setdoublemodal(false)}/>}
                    </div>
             
                    


            </div>
      </div>
    </div>
  )
}

export default CommentModal
