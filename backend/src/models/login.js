import mongoose, { Schema, startSession, Types } from "mongoose";

const loginSchema = new Schema (
    {
        email:{
            type:String,
            required: true,
            lowercase: true
        },

        password:{
            type:String,
            required:[true, "password is required"],
        }
    },

    {
        timestamps:true,
    }
)