import React, { useDebugValue, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { use } from 'react';
import { readFileasDataUrl } from './DataUrl.jsx';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { setPosts } from '../Redux/PostSlice.jsx';
import Post from './Post.jsx';


function CreatePostModal({openPostModal,setOpenPostModal,closemodal}) {
    if(!openPostModal) return null;
    const modalRef = useRef();
    const closePop = (e) =>{
        if(modalRef.current === e.target) closemodal();
    }

    const {user} = useSelector(store=>store.auth);
    const {posts} = useSelector(store=>store.post);
    const dispatch = useDispatch();

    
    const [pic,setPic] = useState('');
    const [caption,setCaption] = useState('');
    const [ImgPreview,setImgPreview] = useState('');
    const [loader,setLoader] = useState(false);
    
    const fileChangehandler = async (e)=>{
        const file = e.target.files?.[0];
        if(file) {
            setPic(file);
            const dataUrl = await readFileasDataUrl(file);
            setImgPreview(dataUrl);
        }
    }

    const postref = useRef();

    const createPostHandler = async(e)=>{
  
      // console.log('Pic wala :', pic, "Caption :",caption);

        const formData = new FormData();
        formData.append("caption", caption);
        if(ImgPreview) formData.append("image",pic);
        
        try{
          setLoader(true);
          const res = await axios.post('http://localhost:1000/api/v1/posts/addPost', formData, {headers:{"Content-Type":'multipart/form-data'}, withCredentials:true})
          if(res.data.success){
            dispatch(setPosts([res.data.newpost,...posts]))
            setOpenPostModal(false); // iske chalte toastify nhi aa rha hai Bc isko hata denge toh aa jayege toast
            toast.success(res.data.message);
          }
        }
        catch(error){
          toast.error(error.response.data.message);
          console.log('Error Occured',error);
        }finally{
          setLoader(false);
        }
        // closemodal();
    }
    

  return (
    <div ref={modalRef} onClick={closePop} className='fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-30 flex items-center justify-center'>
      <div className='ml-16 sm:ml-0 m-3'>
      <ToastContainer position='bottom-center' theme='dark' autoClose={1000}/>


            <button onClick={closemodal}><IoMdClose className='text-2xl text-black'/></button>

            <div className='bg-gray-200 rounded-md p-4 mx-auto md:w-[400px]'>
           
                <h1 className='text-2xl font-semibold mb-3'>Create a Post</h1>
                <p className='flex items-center justify-start gap-2'>
                
                   <img src={user?.profilePic} width={30} className='aspect-square rounded-full'/>
                   <span>
                   <span>{user?.username}</span>
                   <span className='block text-gray-600 text-[10px]'>{user?.bio}</span>
                   </span>
                </p>

                <textarea value={caption} onChange={(e)=>setCaption(e.target.value)} maxLength={100} rows={4} cols={10} placeholder='Add caption' className='w-full bg-transparent outline-none my-2'/>
                <input ref={postref} type='file' className='hidden' name='upic' onChange={fileChangehandler}/>
                
                {ImgPreview && (
                  <div> <img className='object-cover aspect-auto w-[40%] mx-auto mb-5' width={30} src={ImgPreview} alt='preview_img'/> </div>
                )}

                {pic?.name ? 
                <button className='w-full text-center hover:bg-blue-600 text-white bg-blue-500 rounded-md px-2 py-1.5'>{pic?.name}
                <IoMdClose onClick={()=>{setPic(null), setImgPreview(null)}} className='text-2xl text-black inline hover:text-white'/>
                </button>  
                        :
                <button onClick={()=>postref.current.click()} className='w-full text-center hover:bg-blue-600 text-white bg-blue-500 rounded-md px-2 py-1.5'>Choose a pic from your device</button> }
                {ImgPreview && (loader ? (<button className='w-full text-white my-2 rounded-md text-center bg-black hover:bg-gray-800 font-bold text-lg p-1.5'>Please wait...</button>) : (<button onClick={createPostHandler} className='w-full text-white my-2 rounded-md text-center bg-black hover:bg-gray-800 font-bold text-lg p-1.5'>Post</button>))}
                
            </div>
      </div>
    </div>
      
    
  )
}

export default CreatePostModal
