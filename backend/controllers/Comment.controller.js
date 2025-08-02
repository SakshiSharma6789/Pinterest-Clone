import express from 'express';
import Comment from "../models/comment.model.js"
import User from '../models/user.model.js';



export const getPostComments = async (req,res)=>{
    const {postId} = req.params

    const comments = await Comment.find({pin:postId})
    .populate("user" , "userName img displayName")
    .sort({createdAt: -1});

    res.status(200).json(comments);



}

export const addComment = async (req,res)=>{
    const {description , pin} = req.body

    const userId = req.userId;
         const comment = await Comment.create({description , pin, user:userId});

   
res.status(200).json(comment);


    
}

export const deleteComment = async (req , res)=>{


    //comment id from url
    const {id} = req.params;
    const userId  = req.userId;

    const comment = await Comment.findById(id)

    if(!comment){
        return res.status(404).json({message:"comment not found"});
    }
    if(comment.user.toString() != userId){
       return res.status(403).json({ message: "Unauthorized user" });

    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({message:"comment deleted successfully"});


    
    

}