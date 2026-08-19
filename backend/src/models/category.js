import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true

        },
        description: {
            type: String,
            trim: true
        },
    },

    {
        timestamps: true,
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;