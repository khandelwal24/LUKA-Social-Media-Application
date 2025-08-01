import react, { useEffect } from 'react'
import './App.css'
import SignUp from './Components/SignUp.jsx'
import Login from './Components/Login.jsx'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom'
import Home from './Components/Home.jsx'
import Profile from './Components/Profile.jsx'
import LeftSidebar from './Components/LeftSidebar.jsx'
import EditProfile from './Components/EditProfile.jsx'
import ChatPage from './Components/ChatPage.jsx'
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import store from './Redux/Store.jsx'
import { setSocket } from './Redux/SocketSlice.jsx'
import { setOnlineUsers } from './Redux/ChatSlice.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'


function App() {

  const {user} = useSelector(store=>store.auth);
  const {socket} = useSelector(store=>store.socketio);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(user){
      const sockio = io('http://localhost:1000',{ query:{userId:user?._id}, transports:['websocket'] });
      // to stop un-necessary api calls we add transposts:'websocket'
      dispatch(setSocket(sockio));

      //listing all events
      sockio.on('getOnlineUsers',(onlineUser)=>{
        dispatch(setOnlineUsers(onlineUser))
      });
 
      // cleaup function...
      return () => {
        sockio?.close();
        dispatch(setSocket(null));
      }
    }


    else if(socket){
        socket?.close();
        dispatch(setSocket(null));
    }

  },[user,dispatch]);

  return (

    <BrowserRouter>
      <Routes>
        <Route path='/SignUp' element={ <ProtectedRoute><SignUp/></ProtectedRoute> }/>
        <Route path='/Login' element={<ProtectedRoute><Login/></ProtectedRoute>} />        
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/profile/:id' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/account/Edits' element={<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
        <Route path='/chats' element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>

  
  )
}

export default App
