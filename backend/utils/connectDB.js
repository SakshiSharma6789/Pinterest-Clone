import mongoose from "mongoose"
import dotenv from "dotenv";


dotenv.config(); // <== Needed to load .env


const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB is connected")
    }
    catch(err){
        console.log("MONGODB CONNECTION ERROR" , err)
    }

}

export default connectDB;