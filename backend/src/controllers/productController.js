import Product from "../models/product.js";
import Category from "../models/category.js";

//create product
export const createProduct = async (req, res) => {
    try {
        const { productName,
            productCategory,
            productPrice,
            productCostPrice,
            productBrand,
            productSize,
            productQuantity,
            productColor,
            productMaterial,
            productManufactureDate,
            productDescription
        } = req.body;

        // if (!productName || !productCategory || productPrice == null || productCostPrice == null || !productBrand || !productSize ||
        //     !productQuantity || !productColor || !productMaterial ||
        //     !productManufactureDate || productDescription) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please fill the empty fileds"
        //     });
        // }

         if (!productName || productPrice == null || !productCategory || !productQuantity) {
            return res.status(400).json({
                success: false,
                message: "Please fill the empty fileds"
            });
        }

        const existingCategory = await Category.findById(req.body.productCategory);

        if (!existingCategory) {
            return res.status(400).json({
                success: false,
                message: "category not exist"
            });
        }

        const product = await Product.create({
            productName,
            productCategory,
            productPrice,
            productCostPrice,
            productBrand,
            productSize,
            productQuantity,
            productColor,
            productMaterial,
            productManufactureDate,
            productDescription
        });
        return res.status(201).json({
            success:true,
            message:"Product Create Successfully",
            product,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    };
}

//get all product

export const getproduct = async (req, res) =>{
    try{
        const products =(await Product.find()
        .populate("productCategory", "name").sort({createdAt:-1}));

        return res.status(200).json({
            success:true,
            total:products.length,
            products,
        });
    }
    catch(error){
        console.log (error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};

// get single product

export const getproductById = async (req, res) =>{
    try{
        const product =await Product.findById(req.params.id).populate("productCategory");

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found",
            });
        }
        return res.status(200).json({
            success:true,
            product,
        });
    }
    catch(error){
        console.log (error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

//update product

export const updateProduct = async (req, res) =>{
    try{
        // const {id} = req.params;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
            }
        ).populate("productCategory");

        if (!product){
            return res.status(404).json({
                success:false,
                message:"product not found",
            });
        }
        return res.status(200).json({
            success:true,
            message:"product update Successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

//Delete product

export const deleteProduct = async (req, res) =>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }

        return res. status(200).json({
            success:true,
            message:"Product Delete Successfullf"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}