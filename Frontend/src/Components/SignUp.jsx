import React, { useState,useEffect } from 'react'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
// import logo from '../assets/logo.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useSelector } from 'react-redux';


function SignUp() {
    
    const navigate = useNavigate();
    const path = useLocation();
    const {user} = useSelector(store=>store.auth);

    const [showpassword,setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [userInfo,setUsrInfo] = useState({
        username:'',
        email:'',
        password:''
    })

    const getVal = (e)=>{
        const oldData = {...userInfo};
        const InputName = e.target.name;
        const InputValue = e.target.value;
        oldData[InputName] = InputValue;
        setUsrInfo(oldData);
    }
    
    // Isme Api call Karenge...
    const handleSubmit = async (e) =>{
        e.preventDefault();
        e.stopPropagation();
        // console.log(userInfo);
        try{
            setLoading(true);
            const res = await axios.post('https://luka-social-media-application.onrender.com/api/v1/user/register',userInfo, {headers:{"Content-Type":'application/json'}, withCredentials:true });
            if(res.data.success){
                toast.success(res.data.message);
                setUsrInfo({
                    username:'',
                    email:'',
                    password:''
                })
                setTimeout(()=>navigate('/Login'),2000); // After 2 seconds naviagate kar dega to Login page
            }
        }
        catch(error){
            console.log('Error Occured',error);
            toast.error(error.response.data.message)
        }
        finally{
            setLoading(false);
        }
    }


    useEffect(()=>{
        if(user) navigate('/');
    },[])


  return (

    <div className='h-screen w-screen flex justify-center items-center bg-gray-800'>
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
    <div className='w-full p-5 my-3'>
        {/* <img src={logo} width={100} className='mx-auto animate-bounce'/> */}
    <form onSubmit={handleSubmit} className='max-w-[400px] mx-auto p-4 bg-gray-300 border border-black rounded-md shadow-xl overflow-hidden'>
        <p className='text-center text-3xl font-bold '> {/* <img src={logo} width={80} className='mx-auto'/> */} LUKA</p>
        <p className='sm:text-md text-sm text-center mb-4'>Sign Up to see Photos & Videos of Your friends</p>
        
        <p className='mb-4'>
        <label className='font-semibold'>Username : </label>
        <input required type='text' placeholder='Enter username' name='username' value={userInfo.username} onChange={getVal}  className='p-2 w-full rounded-md focus-visible:ring-1 outline-blue-500'/>
        </p>

        <p className='mb-4'>
        <label className='font-semibold'>Email : </label>
        <input required type='email' placeholder='Enter email' name='email' value={userInfo.email} onChange={getVal}  className='p-2 w-full rounded-md focus-visible:ring-1 outline-blue-500'/>
        </p>

        <p className='mb-4'>
        <label className='font-semibold'>Password : </label>
        <p className='relative'>
        <input required type={showpassword ? 'text' : 'password'} placeholder='Enter password' name='password' value={userInfo.password}  onChange={getVal} className='p-2 w-full rounded-md focus-visible:ring-1 outline-blue-500'/>
        {showpassword ? <FaEye className='absolute right-2 top-[33%] hover:cursor-pointer' onClick={()=>setShowPassword(!showpassword)}/> : <FaEyeSlash className='absolute right-2 top-[33%] hover:cursor-pointer' onClick={()=>setShowPassword(!showpassword)}/> }        
        </p>
        </p>

        <button type='submit' className='w-full mt-4 mb-2 text-center bg-black text-white font-semibold p-2 rounded-md hover:bg-gray-700'>Sign Up</button>
        <p className='text-center'>Already have an account? <NavLink to={'/Login'} className='text-blue-700 underline hover:text-black hover:font-semibold'>Login</NavLink> </p>

    </form>
   
      
    </div>
    </div>
  )
}

export default SignUp
