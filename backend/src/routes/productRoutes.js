import express from "express";
import { createProduct,getproduct,getproductById,updateProduct,deleteProduct } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router =express.Router();

router.post ("/",authMiddleware, adminMiddleware, createProduct);
router.put ("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete ("/:id", authMiddleware, adminMiddleware, deleteProduct);

router.get ("/", authMiddleware, getproduct);
router.get ("/:id", authMiddleware, getproductById);

export default router;