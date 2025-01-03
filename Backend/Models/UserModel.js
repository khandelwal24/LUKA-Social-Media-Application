import mongoose from "mongoose";
import path from 'path'
import express from 'express'

//********* User Schema********///
const User_Schema = new mongoose.Schema({
    username:{type:String, required:true, unique:true, trim:true},
    email:{type:String, required:true, trim:true, unique:true},
    password:{type:String, required:true},
    profilePic:{type:String, default:''},
    bio:{type:String, default:''},
    gender:{type:String, enum:['Male',"Female"]},
    followers:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    posts:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
    bookmarks:[{type:mongoose.Schema.Types.ObjectId, ref:'Post'}]
},{timestamps:true})
export const User_Model = mongoose.model('User',User_Schema);


//******** Posts Schema **********//
const Post_Schema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
},{timestamps:true})
export const Post_Model = mongoose.model('Post',Post_Schema);


//******Comments_Schema*******//
const Comment_Schema = new mongoose.Schema({
    text:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    post:{type:mongoose.Schema.Types.ObjectId, ref:'Post', required:true},
},{timestamps:true})
export const Comment_Model = mongoose.model('Comment',Comment_Schema);



// For chats and Messages we have to made 2 more models : 




//******* Message Model **********/
const Message_Schema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    receiverId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    message:{type:String, required:true},
})
export const Message_Model = mongoose.model('Message',Message_Schema)



//********Conversation Schema***********/
const Convo_Schema = new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    messages:[{type:mongoose.Schema.Types.ObjectId, ref:'Message'}],
})
export const Convo_Model = mongoose.model('Conversation',Convo_Schema);