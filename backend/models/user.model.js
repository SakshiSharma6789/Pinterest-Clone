import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    displayName :{
        type:String,
       // required:true,
    },
    userName :{
        type:String,
        required:true,
    },
    email :{
        type:String,
        required:true,
    },
    img :{
        type:String,
        // required:true,
    },
    hashedPassword :{
        type:String,
        required:true,
    },

   
},
  {timestamps: true}


);
export default mongoose.model("User" , userSchema)