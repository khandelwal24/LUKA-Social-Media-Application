import React, { useState } from 'react'
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaRegHeart, FaToiletPaperSlash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa6";
import CommentModal from './CommentModal';
import { use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../Redux/Store';
import EditModal from './EditModal';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { setPosts, setSelectedPost } from '../Redux/PostSlice.jsx';
import { createAction } from '@reduxjs/toolkit';




function Post({post}) {
 
    const[like,setlike] = useState(false);
    const[bookmark,setbookmark] = useState(false);
    const [text,setText] = useState("");

    const dispatch = useDispatch();
    const {posts} = useSelector(store=>store.post);
    const {user} = useSelector(store=>store.auth);

    const changeEventHandler = (e)=>{
        const inputText = e.target.value;
        if(inputText.trim()) setText(inputText);
        else setText("");
    }

    const [modal,setShowModal] = useState(false);
    const [editModal,setEditModal] = useState(false);

    // const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false)
    // const [likeCnt, setLikeCnt] = useState(post.likes.length);

    const [newCommet,setNewComment] = useState(post.comments);

    const deletePostHandler = async(e) =>{
      try{
        const res = await axios.delete(`http://localhost:1000/api/v1/posts/delete/${post._id}` , {withCredentials:true})
        // console.log(res.data);
        if(res.data.success){
          toast.success(res.data.message);
          const updatedPostsData = posts.filter((postItems)=>postItems?._id !== post._id);
          dispatch(setPosts(updatedPostsData));
          // setEditModal(false); // iske chalte toastify nhi aa rha hai 
        }
      }
      catch(error){
        console.log('Error Occured',error);
        toast.error(error.response.data.message);
      }
    }

    
    // const Like_Unlike_Handler = async(postId)=>{
    //   try{
    //     const act = liked ? 'dislike' : 'like'
    //     const res = await axios.get(`http:localhost:1000/api/v1/posts/${postId}/${act}`,{headers:{"Content-Type":'application/json'}, withCredentials:true})
    //       console.log(res);
    //     if(res.data.success){
    //       const updateLikes =  liked ? likeCnt-1 : likeCnt+1;
    //       setLikeCnt(updateLikes);
    //       setLiked(!liked); // toggle karte jao.....
    //       toast.success(res.data.message);
    //       // apne post ko update karo.....
    //       const updatedPostData = posts.map((v)=> v._id === post._id ? {...v,likes:liked ? v.likes.filter(id=>id !== user._id) : [...v.likes, user._id]} : v )
    //       dispatch(setPosts(updatedPostData));
    //     }
    //   }
    //   catch(error){
    //     console.log('error Occured',error);
    //     toast.error(error.response.data.messsage);
    //   }
    // }
    // console.log(likeCnt);
  

    const commentHandler = async () =>{
      try{
       const res = await axios.post(`http://localhost:1000/api/v1/posts/${post._id}/comment`,{text},{headers:{"Content-Type":'application/json'},withCredentials:true});
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

    const bookmarkHandler = async(postId) =>{
      try{
        const res = await axios.get(`http://localhost:1000/api/v1/posts/${postId}/bookmark`,{headers:{"Content-Type":'application/json'}, withCredentials:true});
        // console.log(res.data);
        if(res.data.success){
          toast.success(res.data.message);
        }
      }
      catch(error){
        console.log('Error Occured',error);
      }
    }
    
  return (
    <div className='mb-10 px-3'>
      <ToastContainer theme='dark' position='top-center' autoClose={1000} />
      <div className='flex gap-1 items-center justify-between px-[2px]'>
      <div className='flex gap-1 items-center'>
        {/* <IoPersonCircleSharp className='text-2xl'/> */}
        <img src={post.author?.profilePic} width={25} className='aspect-square rounded-full'/>
        <span>{post.author?.username}</span>
        <span> { user._id === post.author?._id ? <span className='text-xs font-bold bg-blue-500 p-0.5 rounded-3xl text-white '>Author</span> : '' }</span>
      </div>
        <BsThreeDots onClick={()=>setEditModal(true)} className='text-2xl hover:cursor-pointer'/>
        {editModal && <EditModal post={post} deletePostHandler={deletePostHandler} closemodal = {()=>setEditModal(false)} /> }
      </div>
      
      <img className='mt-2 rounded-sm border-black border p-1 aspect-auto w-full' src={post.image}/>
      
      <div className='flex item items-center justify-between gap-3 mt-2 mb-1 px-[2px]'>
      
      <div className='flex item items-center gap-3'>
      {like ? <FaHeart onClick={()=>setlike(!like)} className ='text-2xl hover:cursor-pointer text-red-600'/> : <FaRegHeart onClick={()=>setlike(!like)} className ='text-2xl hover:cursor-pointer'/> }
     
      <FaRegComment onClick={()=>{setShowModal(true); dispatch(setSelectedPost(post)) }} className ='text-2xl hover:cursor-pointer'/> 
      <FiSend className='text-2xl hover:cursor-pointer'/>
      </div>

      <div>{bookmark ? <FaBookmark onClick={()=>{setbookmark(!bookmark); bookmarkHandler(post?._id)}} className ='text-2xl hover:cursor-pointer' /> : <FaRegBookmark onClick={()=>{setbookmark(!bookmark); bookmarkHandler(post?._id)}} className ='text-2xl hover:cursor-pointer'/> }</div>

      </div>
      <span className='font-semibold px-1 mb-2'>{post.likes.length} likes</span>
      <span className='font-semibold px-1 mb-2 block'>{post.author?.username} : <span className='font-serif'>{post.caption}</span></span>

      <button onClick={()=>{setShowModal(true); dispatch(setSelectedPost(post)) }} className='font-medium px-1 mb-2 block text-gray-500 cursor-pointer'>View {newCommet.length} Comments</button> 
     
      <div className='flex justify-between items-center'>
        <input value={text} onChange={changeEventHandler} type='text' placeholder='Add a comment...' className='text-sm w-full font-medium p-1.5 outline-none'/>
        {text && <button onKeyPress={(e)=>{e.key === "Enter" && commentHandler}} onClick={commentHandler} className='text-[#3BADF8]'>Post</button> }
      </div>
      { modal && <CommentModal post={post} closeModal={()=>setShowModal(false)} />}
    </div>
  )
}

export default Post
