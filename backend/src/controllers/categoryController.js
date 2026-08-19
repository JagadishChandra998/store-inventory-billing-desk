import Category from "../models/category.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success:false,
                message:'Category name is required',
            });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exit"
            });
        }

        const category = await Category.create({
            name,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Category create Successfully"
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

//get category

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "productCategory",
                    as: "products"
                }
            },
            {
                $project: {
                    _id:1,
                    name: 1,
                    createdAt:1,
                    productCount:{ $size: "$products" }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            total: categories.length,
            categories
        });

    } catch (error) {
        console.log("CATEGORY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// Update category

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true },
        );

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category update successfully",
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

//Delete category

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category delete successfully",
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }


};
