import express from 'express'
import { Convo_Model, Message_Model } from '../Models/UserModel.js';
import { getRSocketId, io } from '../Socket/Socket.js';
import mongoose from 'mongoose';


export const sendMessage = async(req,res)=>{
    try{    
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage:message} = req.body;
        // console.log(message);

        let gotConvo = await Convo_Model.findOne({participants:{$all:[senderId,receiverId]}})

        // Establishes the conversation if not started Yet...
        if(!gotConvo) gotConvo = await Convo_Model.create({participants:[senderId,receiverId]});
        
        const newMessage = await Message_Model.create({senderId,receiverId,message})
        if(newMessage) gotConvo.messages.push(newMessage._id)

        await Promise.all([gotConvo.save(),newMessage.save()]);

        // Implement Socket io...for real time data transfer..
        
        const receiverSocketId = getRSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }
        
        res.status(200).json({message:'Sent Message',newMessage:newMessage,success:true,gotConvo});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(400).json({message:'Error Occured',success:false});
    }
}

export const getMessage = async(req,res)=>{
    try{
        const senderId = new mongoose.Types.ObjectId(req.id);
        const receiverId = new mongoose.Types.ObjectId(req.params.id);

        const convo = await Convo_Model.findOne({
          participants:{$all:[senderId,receiverId]}
        }).populate('messages');

        if(!convo) return res.status(404).json({message:'No conversation found between the participants', success:false});
        if(!convo.messages?.length) return res.status(400).json({message:"Conversation found but no messages Available",success:false,convo:[]});
        
        res.status(200).json({success:true,message:'All messages b/w participants fetched successfully',convo:convo?.messages});
    }
    catch(error){
        console.log('Error Occured',error);
        res.status(401).json({message:'Error Occured MC',success:false});
    }
}