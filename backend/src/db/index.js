import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';

const connectDB = async () =>{
    try{
        const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log (`MongoDB connected: ${connectionDB.connection.host}`);
    }
    catch (error){
        console.log("MONGODB Connection FAIL", error);
        process.exit(1);

    }
}
export default connectDB;
