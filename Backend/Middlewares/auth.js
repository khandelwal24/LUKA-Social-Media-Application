import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { User_Model } from '../Models/UserModel.js'

export const isAuthenticate = async(req,res,next)=>{
    try{
        // console.log('Body wala Token : ',req.body.token);
        // console.log('Cookie wala Token : ',req.cookies.RCookie);

        const token = req.cookies.RCookie || req.body.token;
        if(!token) return res.status(401).json({message:'token not found Please Login',success:false});
        // console.log('Token Mila : ',token);

        try{
            const decode = await jwt.verify(token,process.env.jwt_secret);
            if(!decode) return res.status(401).json({message:'Invalid Token',success:false});
            // console.log('Decode mae kya hai : ',decode);
            // req.rsp = decode
            req.id = decode.user_Id; // yeh payload se aaya hai
        }
        catch(error){
            console.log('Error Occured',error);
            res.status(401).json({message:"Error Occured",success:false});
        }
        next();
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(401).json({message:"Error Occured",success:false});
    }
}
