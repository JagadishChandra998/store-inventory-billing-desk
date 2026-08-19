import mongoose, { Schema } from "mongoose";

const billingschema = new Schema(
    {
        customerName:{
            type:String,
            required:true
        },
        customerPhone:{
            type:Number,
            required:true,
            minlength:10,
        },
        billDate:{
            type:Date,
            default:Date.now,
        },
        items:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required: true,
                },
                quantity:{
                    type:Number,
                    required:true,
                    min:1,
                },
                price:{
                    type:Number,
                    required:true
                },

            },
        ],
        grandTotal:{
            type:Number,
            required:true,
            default:0,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

    },

    {
        timestamps:true,
    },
);

const Bill = mongoose.model("Bill",billingschema);
export default Bill;