import express from "express";
import { createCategory,getCategories,updateCategory,deleteCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js"
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createCategory);
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

router.get("/", authMiddleware, getCategories);


export default router;