import mongoose from "mongoose";
import express from 'express'
import { User_Model, Post_Model, Comment_Model } from "../Models/UserModel.js";
import cloudinary from "../Utils/CloudinaryP.js";
import { getRSocketId } from "../Socket/Socket.js";


export const AddnewPost = async(req,res)=>{
    try{
        const {caption} = req.body
        const image = req.file
        const authorId = req.id

        if(!image) return res.status(400).json({message:'Image required',success:false});
        
        const cloudResponse = await cloudinary.uploader.upload(req.file.path, {folder:'Instagram/Posts'});
        const newpost = await Post_Model.create({caption,image:cloudResponse.secure_url,author:authorId})
        // console.log('Cloudinary Response : ',cloudResponse);
        
        const user = await User_Model.findById(authorId).select('-password');

        if(user){
            user.posts.push(newpost._id);
            await user.save();
        }

        await newpost.populate({path:'author', select:'-password'});

        res.status(200).json({message:'New post Added Successfully',success:true,newpost});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured dude',success:false});
    }
}

export const getAllpost = async(req,res)=>{
    try{
        const posts = await Post_Model.find().sort({createdAt:-1})
        .populate({path:'author', select:'username profilePic'})
        .populate({path:'comments', sort:{createdAt:-1}, populate:{path:'author', select:'username profilePic'} });
        return res.status(200).json({message:'All Posts fetched Successfully',success:true,posts })
    }
    catch(error){ 
        console.log('Error Occured',error);
    }
}

export const getUserPost = async(req,res)=>{
    try{
        const authorId = req.id;
        const posts = await Post_Model.find({author:authorId}).sort({createdAt:-1})
        .populate({path:'author',select:'username profilePic'})
        .populate({path:'comments',sort:{createdAt:-1},populate:{path:'author', select:'username profilePic'}})
        res.status(200).json({message:'All posts of logged in user are here:',posts, success:true})
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}

export const likePost = async(req,res)=>{
    try{
        const like_Karne_Wale_ki_id = req.id;
        const post_jo_like_hoga_uski_id = req.params.id;
        const post = await Post_Model.findById(post_jo_like_hoga_uski_id);
        if(!post) return res.status(400).json({message:'No post Available',success:false});

        // like logic Started...
        await post.updateOne({$addToSet:{likes:like_Karne_Wale_ki_id}})
        // await post.likes.push() // we can also use this method but the likes must be from unique users thus we use set
        await post.save();

        // implementing socket io for real time notification..

        const user = await User_Model.findById(like_Karne_Wale_ki_id).select('username profilePic');
        const PostOwnerId = post.author._id.toString();
        if(PostOwnerId !== like_Karne_Wale_ki_id){
            //emit notification event
            const notification = {
                type:'like',
                userId:like_Karne_Wale_ki_id,
                userDetails:user,
                postId:post_jo_like_hoga_uski_id,
                message:'Your post was Liked',
            } 
            const postOwnerSocketId = getRSocketId(PostOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }

        return res.status(200).json({message:'Post Liked Successfully', success:true});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}

export const dislikePost = async(req,res)=>{
    try{
        const like_Karne_Wale_ki_id = req.id;
        const post_jo_like_hoga_uski_id = req.params.id;
        const post = await Post_Model.findById(post_jo_like_hoga_uski_id);
        if(!post) return res.status(400).json({message:'No post Available',success:false});

        // dislike logic Started...
        await post.updateOne({$pull:{likes:like_Karne_Wale_ki_id}})
        await post.save();
        // implementing socket io for real time notification..

        const user = await User_Model.findById(like_Karne_Wale_ki_id).select('username profilePic');
        const PostOwnerId = post.author.toString();
        if(PostOwnerId!==like_Karne_Wale_ki_id){
            //emit notification event
            const notification = {
                type:'dislike',
                userId:like_Karne_Wale_ki_id,
                userDetails:user,
                postId:post_jo_like_hoga_uski_id,
                message:'Your post was Liked',
            }
            const postOwnerSocketId = getRSocketId(PostOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }


        return res.status(200).json({message:'Post disliked Successfully', success:true});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}

export const addComment = async(req,res)=>{
    try{
        const postId = req.params.id; // kon se post pe comment add hoga uski id
        const comment_Karne_Wala_ki_Id = req.id; // The person who will add comment that the logged in user

        const {text} = req.body;
        if(!text) return res.status(400).json({message:'Text is required',success:false});
        const post = await Post_Model.findById(postId);
        const comment = await Comment_Model.create({text,author:comment_Karne_Wala_ki_Id,post:postId})

        await comment.populate({path:'author',select:'username,profilePic'})
        post.comments.push(comment._id);
        await post.save();
        return res.status(200).json({message:'Comment Added Successfully',success:true,comment});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}

export const getCommentbyEachPost = async(req,res)=>{
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const comments = await Comment_Model.find({post:postId}).populate({path:'author',select:'username,profilePic'});
        if(!comments) return res.status(400).json({message:'No comments found',success:false})
        return res.status(200).json({message:'Here are the comments', success:true,comments})
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}

export const deletePost = async(req,res)=>{
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post_Model.findById(postId);
        if(!post) return res.status(404).json({message:'Post does not exits or Already deleted',success:false});

        // check if the logged in user is the owner of the post or not..
         if(post.author.toString() !== authorId) return res.status(403).json({message:'You cannot delete this post', success:false});

        // delete post;
        await Post_Model.findByIdAndDelete(postId);
        
        // delete the post_id from post array of userModel also..
        let user = await User_Model.findById(authorId);
        user.posts = user.posts.filter((id)=>id.toString() !== postId);
        await user.save();

        // delete Associated Comments also..
        await Comment_Model.deleteMany({post:postId});

        return res.status(200).json({message:'Post deleted Successfully',success:true});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(403).json({messgae:'Error Occured',success:false});
    }
}

export const bookmarkPost = async(req,res)=>{
    try{
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post_Model.findById(postId)
        if(!post) return res.status(404).json({message:'Post not found',success:false});
        const user = await User_Model.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // Already bookmarked hai toh -> removed karo from bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            return res.status(200).json({type:'unsaved',message:'Post Removed from bookmarked successfully',success:true});
        }
        else{
            // bookmark add karna hoga
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            return res.status(200).json({type:'saved',message:'Post added to bookmark successfully',success:true});
        }
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}