
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";  // to create cookie
import Follow from "../models/follow.model.js";


export const registerUser = async (req,res)=>{
    const {userName , displayName , email , password} = req.body
    if(!userName || !email || !password ){
        return res.status(400).json({message:"all feilds are required! "})
    }

    const newHashedPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        userName , 
        displayName , 
        email ,    
        hashedPassword : newHashedPassword,

    });


    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET)

    res.cookie("token" , token ,{
        httpOnly:true , 
        secure:process.env.NODE_ENV === "production" ,
        maxAge: 30 *24*60*60*1000 // 30 days
    })

    const {hashedPassword , ...detailsWithoutPassword} = user.toObject();


    res.status(201).json(detailsWithoutPassword);
   


};
export const loginUser = async (req,res)=>{
    const {email , password} = req.body
    if(!email || !password ){
        return res.status(400).json({message:"all feilds are required! "})
    }
    const user = await User.findOne({email})

    if(!user){
        return res.status(401).json({message: "Invalid email or password"})
    }

    const isPasswordCorrect = await bcrypt.compare(password ,user.hashedPassword )
    if(!isPasswordCorrect){
        return res.status(401).json({message: "Invalid email or password"})
    }

    const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET)

    res.cookie("token" , token ,{
        httpOnly:true , 
        secure:process.env.NODE_ENV === "production" ,
        maxAge: 30 *24*60*60*1000 // 30 days
    });

    const {hashedPassword , ...detailsWithoutPassword} = user.toObject();


    res.status(200).json(detailsWithoutPassword);
   

};
export const logoutUser = async (req,res)=>{
    res.clearCookie("token")
    res.status(200).json({message:"Logout successfull"})

};

export const getUser = async (req,res)=>{
    const { userName } = req.params;

    const user = await User.findOne({userName});

    if(!user){
        return res.status(404).json({message:"user not found"})
    }


    const {hashedPassword , ...detailsWithoutPassword} = user.toObject();



    // to get number of followers and follwing
    const followerCounts = await Follow.countDocuments({following:user._id})
    const followingCounts = await Follow.countDocuments({follower:user._id})

    const token= req.cookies.token ;

    if(!token){

        res.status(401).json(
            {...detailsWithoutPassword , 
                followerCounts , 
                followingCounts , 
                isFollowing:false})

    } 
    else{
        jwt.verify(token , process.env.JWT_SECRET , async(err , payload)=>{
            

             if(!err){
                 const isExits = await Follow.exists({
                    follower:payload.userId,
                    following: user._id, // this is our id mtlb jisne follow kiya hai , mtlb jo login ho rkha hai
                 });
                res.status(200).json(
                 {...detailsWithoutPassword , 
                   followerCounts , 
                   followingCounts , 
                   isFollowing:isExits?true : false
                })

                 }

             req.userId = payload.userId;
           
        })

    }

        
           

        





   


};


export const followUser = async (req,res)=>{
    const { userName } = req.params;

    const user = await User.findOne({userName});


    const isFollowing = await Follow.exists({
        follower: req.userId,
        following: user._id ,

    })

    if(isFollowing){
       await Follow.deleteOne({follower: req.userId , following: user._id})
    }
    else{
        await Follow.create({follower: req.userId , following: user._id})
    }


    const {hashedPassword , ...detailsWithoutPassword} = user.toObject();


    res.status(200).json({message: "successfull"});


};


