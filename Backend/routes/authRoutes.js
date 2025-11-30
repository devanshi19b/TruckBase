import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();


router.post("/register", upload.single("companyLogo"), registerUser);


router.post("/login", loginUser);


router.get("/profile", protect, getProfile);

export default router;
