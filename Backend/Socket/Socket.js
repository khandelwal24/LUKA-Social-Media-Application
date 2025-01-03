import {Server} from 'socket.io'
import express from 'express'
import http from 'http'
import 'dotenv/config'

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'https://luka-social-media-application.onrender.com',
        credentials:true,
        methods:["GET","POST"],
    }
})


const socket_Map = {} ; //  this map stores socket.id & corrosponding user_id

export const getRSocketId = (receiverId) => socket_Map[receiverId]


io.on('connection',(sockect)=>{
    const userId = sockect.handshake.query.userId;
    if(userId){
        socket_Map[userId] = sockect.id;
        console.log(`User Connected : UserId = ${userId} & SocketId = ${sockect.id} `);
    }

    io.emit('getOnlineUsers',Object.keys(socket_Map))
    
    sockect.on('disconnect',()=>{
        if(userId){
            delete socket_Map[userId];
            console.log(`User disconnected : UserId = ${userId} & SocketId = ${sockect.id} `);   
        }
        io.emit('getOnlineUsers',Object.keys(socket_Map));
    });
})

export {app,server,io};
