import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import 
{ 
    getUser , 
    registerUser , 
    loginUser ,
    logoutUser ,
    followUser,
} 
from "../controllers/User.controller.js";



import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


const router = express.Router();
 router.get("/:userName" , getUser);

 router.post("/auth/register" , registerUser);
 router.post("/auth/login",loginUser);
 router.post("/auth/logout" , logoutUser);
 router.post("/follow/:userName" ,verifyToken, followUser)

// router.post("/create" , async (req,res)=>{
//     const userInformation = req.body;

//     const hashedPassword = await bcrypt.hash(req.body.password , 10);

//     // console.log(userInformation)

//     await User.create({
//         displayName:req.body.displayName,
//         userName: req.body.userName,
//         email: req.body.email,
//         hashedPassword:hashedPassword,

//     });

//  res.json("user created");
// });

// router.get("/fetch" , async(req,res)=>{
//     const users = await User.findOne({userName:"Test 2"})
//     res.json(users)
// })
// router.patch("/update" , async(req , res)=>{
//     const updateUser = await User.updateOne({userName: "test"} , req.body);
//     res.json(updateUser)
// })

// router.delete("/" , async (req , res)=>{
//     const deleteUser = await User.deleteOne({userName:"Test"});
//     res.json(deleteUser);
// })






export default router ;