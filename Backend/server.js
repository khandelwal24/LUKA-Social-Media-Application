import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'
import exp from 'constants'
import cookieParser from 'cookie-parser'
import userRoute from './Routes/UserRoute.js'
import postRoute from './Routes/PostsRoute.js'
import messageRoute from './Routes/MessageRoute.js'
import {app, server} from './Socket/Socket.js'

// const app = express();

// middlewares....
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:'https://luka-frontend-htpi.onrender.com',
    credentials:true,
    methods:['PUT','POST','GET','DELETE']
}))

// apis yahai aayenge
app.use('/api/v1/user',userRoute);
app.use('/api/v1/posts',postRoute);
app.use('/api/v1/messages',messageRoute);

// Deployment part...
/*
const _dirname = path.resolve();
app.use(express.static(path.join(_dirname,'/Frontend/dist')));
app.get('*',(_,res)=>{
       res.sendFile(path.resolve(_dirname,'Frontend','dist','index.html'))
})
*/

mongoose.connect(process.env.MongoUrl,{dbName:'Insta_Clone'}).then(()=>console.log('MongoDB connected')).catch(()=>console.log('Errro Occured'));

const port = process.env.PORT || 8000;
server.listen(port,()=>console.log(`Server is Running on port ${port}`));

