import express from 'express';
import { registerUser, loginUser,getProfile } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post ("/register", registerUser);
router.post ("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);


// router.get ("/profile", authMiddleware, (req, res) =>{
//     res.status(200).json({
//         success: true,
//         Message:"Welcome to your profile",
//         user:req.user,
//     });
// });

export default router;