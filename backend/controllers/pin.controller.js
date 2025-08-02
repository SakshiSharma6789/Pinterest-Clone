// import SearchPage from "../../client/src/routes/searchPage/SearchPage.jsx";
import { json, response } from "express";
import Pin from "../models/pin.model.js" ;
import User from "../models/user.model.js";
import sharp from "sharp";
import ImageKit from "imagekit";
import likeModel from "../models/like.model.js";
import Jwt from "jsonwebtoken";
import saveModel from "../models/save.model.js";

export const getPins = async (req , res)=>{

    const pageNumber = Number(req.query.cursor)||0;
    // const search = req.query.search;
    const search = req.query.search?.trim();

    const userId = req.query.userId;

    const boardId = req.query.boardId;


    const LIMIT = 21;

    let query ={};
    if(search && search !==""){
        query={
            $or: [
                {title:{$regex:search, $options: "i"}},
                {tags:{$in:[search]}},
            ],
        };

    }
    else if (userId){
        query ={user : userId};
    }
    else if (boardId){
        query = {board : boardId}
    }

const pins = await Pin.find(query).limit(LIMIT).skip(pageNumber * LIMIT);


//     const pins = await Pin.find(
//         search
//         ?
//         {
//         $or:[
//             {title:{$regex:search, $options:"i"}},
//             {tags:{$in:[search]}},
//         ],
//     } : userId ? {user: userId}: {}

// ).limit(LIMIT).skip(pageNumber * LIMIT);
   


    const hasNextPage = pins.length ===LIMIT;

    // await new Promise(resolve=>setTimeout(resolve , 3000))

    res.status(200)
    .json({pins , nextCursor:hasNextPage ? pageNumber + 1 : null});
};


export const getPin = async (req,res)=>{
    const { id } = req.params;

    const pin = await Pin.findById(id).populate("user" , "userName img displayName" );
    res.status(200).json(pin);
}



export const createPin = async (req,res)=>{
  const {title , description , link , board , tags , textOptions , canvasOptions} = req.body;

  const media = req.files.media;
  if((!title , !description , !media)){
    return res.status(400).json({message:"All fields are required!"});
  }
  const parsedTextOptions= JSON.parse(textOptions || "{}")
  const parsedCanvasOptions= JSON.parse(canvasOptions || "{}")
  
   const metadata = await sharp(media.data).metadata()
  
   const originalOrientation = metadata.width < metadata.height ? "portrait" : "landscape"
   const originalAspectRatio = metadata.width / metadata.height

   let clientAspectRatio;
   let width;
   let height;

   if(parsedCanvasOptions.size !== "original"){
    clientAspectRatio = parsedCanvasOptions.size.split(":")[0]/parsedCanvasOptions.size.split(":")[1];

   }
   else{
    parsedCanvasOptions.originalOrientation===originalOrientation ? (clientAspectRatio = originalOrientation) : (clientAspectRatio = 1/originalAspectRatio) ;
   }

   width= metadata.width;
   height= metadata.width / clientAspectRatio;

   const imagekit = new ImageKit({
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint:process.env.IK_URL_ENDPOINT,
   });


   
 // Prepare transformation string

  const textLeftPosition = Math.round((parsedTextOptions.left * width)/375)
  const textTopPosition = Math.round((parsedTextOptions.top *height)/parsedCanvasOptions.height
)
    const transformationString = `w-${width},h-${height}${
      originalAspectRatio > clientAspectRatio ? ",cm-pad_resize" : ""
    },bg-${parsedCanvasOptions.backgroundColor.substring(1)}${
      parsedTextOptions.text
        ? `,l-text,i-${parsedTextOptions.text},fs-${parsedTextOptions.fontSize},lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(1)},l-end`
        : ""
    }`;

   imagekit.upload({
    file : media.data,
    fileName:media.name,
   
    folder:"test",
    transformation:{
      pre:transformationString

    }
   }).then(async (response)=>{
    const newPin = await Pin.create({
      user:req.userId,
      title,
      description,
      link: link || null , 
      board: board || null ,
      tags: tags ? tags.split(",").map(tag=>tag.trim()) : [] ,
      media:response.filePath,
      width:response.width,
      height:response.height,
    });
    //console.dir(response);
    return res.status(201).json(newPin)

   }).catch((err)=>{
    return res.status(500).json(err);
   })
   
};

export const interactionCheck = async (req,res)=>{
  const {id}=req.params;

  const token = req.cookies.token;
   const likeCount = await likeModel.countDocuments({pin:id})
   if(!token){
    return res.status(200).json({likeCount , isLiked:false , isSaved: false})
   }


   

  Jwt.verify(token , process.env.JWT_SECRET , async(err , payload)=>{
            

             if(err){
                  return res.status(200).json({likeCount , isLiked:false , isSaved: false})
             }

             const userId = payload.userId;
           

            const isLiked = await likeModel.findOne({
              user: userId,
              pin:id,

            })
            const isSaved = await saveModel.findOne({
              user: userId,
              pin:id,
              
            })
           return res.status(200).json({likeCount , isLiked: isLiked ? true : false , isSaved:isSaved ? true : false,})

        });
    }

    export const interact = async (req,res)=>{
      const {id} = req.params

      const {type} = req.body
      if(type==="like"){
        const isLiked = await likeModel.findOne({
          pin:id,
          user:req.userId,

        });
        if(isLiked){
          await likeModel.deleteOne({
            pin:id,
            user : req.userId,

          });
        }
        else{
          await likeModel.create({
            pin:id,
            user: req.userId,
          })
        }
      }
      else{
        const isSaved = await saveModel.findOne({
          pin:id,
          user:req.userId,

        });
        if(isSaved){
          await saveModel.deleteOne({
            pin:id,
            user : req.userId,

          });
        }
        else{
          await saveModel.create({
            pin:id,
            user: req.userId,
          })
      }
    }

    return res.status(200).json({message: "Successfull"})
  }









   
