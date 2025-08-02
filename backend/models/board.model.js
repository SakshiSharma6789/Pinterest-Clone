import mongoose from "mongoose";
const {Schema} = mongoose;

const boardSchema = new Schema({
    
    title :{
        type: String,
        required:true,
    },
    
     user :{
        type:Schema.Types.ObjectId,
       ref: "User" , 
       required: true,
    },
},
  {timestamps: true}


);
export default mongoose.model("Board" , boardSchema)