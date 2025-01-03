import React, { useRef, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
// import logo from '../assets/logo.png'

function DoubleCommentModal({closemode}) {
    const modalRef = useRef();
        const closePop = (e) =>{
            if(modalRef.current === e.target) closemode();
        }
    
  return (
    <div ref={modalRef} onClick={closePop} className='fixed h-screen inset-0 bg-gray-200 backdrop-blur-sm bg-opacity-30 flex items-center justify-center'>
         <div className='ml-16 sm:ml-0'>
   
            <button onClick={closemode}><IoMdClose className='text-2xl text-black'/></button>

            <div className='bg-gray-200 flex flex-col text-center rounded-md p-2.5 mx-auto md:w-[300px] border border-black'>
                   <button className='text-red-500 font-bold hover:bg-gray-50 p-1.5 rounded-full'>Unfollow</button>
                   <button className='text-md font-medium hover:bg-gray-50 p-1.5 rounded-full'>Add to favourites</button>
            </div>

            </div>

         </div>
  )
}

export default DoubleCommentModal
