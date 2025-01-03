import React from 'react'
import { IoMdClose } from "react-icons/io";
import { useRef } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import store from '../Redux/Store';
import axios from 'axios';


function EditModal({closemodal,deletePostHandler,post}) {
    const {user} = useSelector(store=>store.auth);
    // const {posts} = useSelector(store=>store.post);


    
    const modalRef = useRef();
    const closePop = (e) =>{
        if(modalRef.current === e.target) closemodal();
    }

  

  return (
    <div ref={modalRef} onClick={closePop} className='fixed inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-30 flex items-center justify-center'>
      <div className='ml-16 sm:ml-0'>

            <ToastContainer 
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <button onClick={closemodal}><IoMdClose className='text-2xl text-black'/></button>


            <div className='bg-gray-200 rounded-md p-4 mx-auto md:w-[400px]'>
                <div className='flex flex-col w-full text-center gap-2'>
                <button className='text-lg hover:bg-gray-100 rounded-full p-1.5 font-semibold text-red-500'> 
                {
                  user && (user?._id === post.author?._id) ? '' : 'Follow'
                } 
                </button>
                <button className='text-lg hover:bg-gray-100 rounded-full p-1.5 font-semibold'>Add to favourite</button>
                {user && (user?._id === post.author?._id) && <button onClick={deletePostHandler} className='text-lg hover:bg-gray-100 rounded-full p-1.5 font-semibold text-red-500'>Delete</button> }
                </div>
            </div>
      </div>
    </div>
  )
}

export default EditModal
