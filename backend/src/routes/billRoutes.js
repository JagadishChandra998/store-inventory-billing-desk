import express, { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createBill,getBills,getBillById,deleteBill } from "../controllers/billController.js";

const router =express.Router();

router.post ("/", authMiddleware, createBill);
router.get ("/", authMiddleware, getBills);
router.get ("/:id", authMiddleware,getBillById);
router.delete("/:id",authMiddleware,deleteBill);

export default router;