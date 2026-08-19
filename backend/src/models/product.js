import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        productCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
            min:0,
        },
        productCostPrice:{
            type:Number,
            // required:true,
        },
        productBrand: {
            type: String,
            // required: true,
        },
        productSize: {
            type: String,
            // required: true,
        },
         productQuantity: {
            type: Number,
            required: true,
            min:0,
        },
         productColor: {
            type: String,
            // required: true,
        },
        productMaterial: {
            type: String,
            // required: true,
        },
        productManufactureDate: {
            type: Date,
            // required: true,
        },
        productDescription: {
            type: String,
        },
    },
    {
        timestamps:true
    }
);

const Product = mongoose.model("Product", productSchema);
export default Product;