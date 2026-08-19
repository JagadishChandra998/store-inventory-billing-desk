import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        fullname:{
            type:String,
            required:true,

        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
        },
         password:{
            type:String,
            required:[true, "Password is required"],
            minlength :6,
        },
        role:{
            type:String,
            required:true,
            enum :["admin", "staff"],
            default: "staff",
        },

    },
    {
        timestamps:true,
    }
);

const User = mongoose.model("User",userSchema);
export default User;