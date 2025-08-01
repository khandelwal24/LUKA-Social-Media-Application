import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User_Model, Post_Model, Comment_Model } from "../Models/UserModel.js";
import { isAuthenticate } from '../Middlewares/auth.js'
import cloudinary from '../Utils/CloudinaryP.js'


export const Register = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        if(!username || !email || !password) return res.status(401).json({message:'Please fill all fields',success:false});
        let rsp = await User_Model.findOne({email})
        if(rsp) return res.status(401).json({message:"Email already exists", success:false});
        const hashPass = await bcrypt.hash(password,10)
        rsp = await User_Model.create({username,email,password:hashPass});
        res.status(200).json({message:'User Registered Successfully',success:true,rsp});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(401).json({message:'Error Occured',success:false});
    }
}

export const Login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(401).json({message:'Please fill all the feilds',success:false});
        let rsp = await User_Model.findOne({email});
        if(!rsp) return res.status(401).json({message:'Invalid Email Id', success:false});
        const validate = await bcrypt.compare(password,rsp.password);
        if(!validate) return res.status(401).json({message:'Invalide Password',success:false});

        const payload = {
            user_Id: rsp._id,
            user_email: rsp.email,
            user_name: rsp.username
        }

        const token = await jwt.sign(payload,process.env.jwt_secret,{expiresIn:'1d'});
        
        const options = {
            httpOnly:true,
            sameSite:'strict',
            maxAge: new Date(Date.now() + 1*24*60*60*1000),
        }

        rsp = rsp.toObject();
        rsp.token = token;
        rsp.password = undefined;

        // populate each post id in the posts array..

        // const populatedPost = await Promise.all(
        //     rsp.posts.map( async (postId)=>{
        //         const post = await Post_Model.findById(postId);
        //         if(post?.author?.equals(rsp._id)) return post;
        //         else return null;
        //     })
        // )

        // rsp.posts = populatedPost;

        // for cookie("cookieName","Value","Options")

        res.cookie("RCookie",token,options).status(200).json({message:`User Logged in Successfully - Welcome back ${rsp.username}`,success:true,rsp})
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(401).json({message:'Error Occured',success:false});
    }
}

export const Logout = async(req,res)=>{
    try{
        return res.cookie('RCookie','',{maxAge:0}).status(200).json({message:'Logged Out Successfully',success:true});
    }
    catch(error){
        console.log('Error Occured',error)
        res.status(401).json({message:'Error Occured',success:false});
    }
}

export const getProfile = async(req,res)=>{
    try{
        const userId = req.params.id
        const rsp = await User_Model.findById(userId).populate({path:'posts', createdAt:-1}).populate({path:'bookmarks',createdAt:-1})
        if(!rsp) return res.status(401).json({message:'User not found',success:false});
        res.status(200).json({message:'User Found',success:true, user:rsp});
    }
    catch(error){
        console.log("Error Occured",error);
        res.status(401).json({message:'Error Occured',success:false});
    }
}

export const editProfile = async(req,res)=>{
    try{
        // Jo logged in user hai wahi toh apna Profie edit kar sakta hai, Thus we reqire the id of Logged in user only 
        const LoggedInUserid = req.id;
        let CloudRsp;
        const {bio,gender} = req.body;
        const profilePic = req.file;

        if(profilePic){
            CloudRsp = await cloudinary.uploader.upload(req.file.path, {folder:'Instagram_clone'});
        }
        // console.log('Cloudinary Response : ',CloudRsp);

        const user = await User_Model.findById(LoggedInUserid).select('-password');
        if(!user) return res.status(404).json({message:'User not found login first',success:false});

        if(bio) user.bio = bio
        if(gender) user.gender = gender
        if(profilePic) user.profilePic = CloudRsp.secure_url;

        await user?.save();
        return res.status(200).json({message:'Profile Edited Successfully',success:true,user});
    }
    catch(error){
        console.log('Error Occured Madarchod',error);
        res.status(401).json({message:'Error Occured',success:false});
    }
}

export const SuggestedUser = async(req,res)=>{
    try{
        const SuggestUser = await User_Model.find({_id:{$ne:req.id}}).select('-password');
        if(!SuggestUser) return res.status(400).json({message:'Currently have not Suggested Users to show'});
        return res.status(200).json({success:true,users:SuggestUser})
    }
    catch(error){
        console.log('Error occured',error);
        res.status(401).json({message:'Error occured',error});
    }
}

export const followUnfollow = async(req,res)=>{
    try{
        const follow_Karne_Wala = req.id; // me - harsh Khandelwal // jo Authenticated user hai logged in hai jo
        const Jisko_follow_karna_hai = req.params.id; // suhani - my 
        if(follow_Karne_Wala === Jisko_follow_karna_hai) return res.status(400).json({message:'You cannot follow/Unfollow Yourself dude', success:false});

        const loggedInUser = await User_Model.findById(follow_Karne_Wala);
        const TargetUser = await User_Model.findById(Jisko_follow_karna_hai);
        
        if(!loggedInUser || !TargetUser) return res.status(401).json({message:'Something is Missing User not found',success:false});

        const isFollowing = loggedInUser.following.includes(Jisko_follow_karna_hai);

        // Whenever You are handling more than one documents/Tables  then we use Promise.all()
        
        if(isFollowing){
            // unfollow karne wala logic aayega
            await Promise.all([
                User_Model.updateOne({_id:follow_Karne_Wala},{$pull:{following:Jisko_follow_karna_hai}}),
                User_Model.updateOne({_id:Jisko_follow_karna_hai},{$pull:{followers:follow_Karne_Wala}})
            ])
            return res.status(200).json({message:'Unfollowed Successfully',success:true});
        }
        else{
            // follow karne wala Logic aayega
            await Promise.all([
                User_Model.updateOne({_id:follow_Karne_Wala},{$push:{following:Jisko_follow_karna_hai}}),
                User_Model.updateOne({_id:Jisko_follow_karna_hai},{$push:{followers:follow_Karne_Wala}})
            ])
            return res.status(200).json({message:'followed Successfully',success:true});
        }        

    }
    catch(error){
        console.log('Error Occured',error);
        res.status(401).json({message:'Error Occured',error});
    }
}



