import express from 'express';
import {
    registerUser,
    loginUser,
    getAllUsers
} from '../controllers/userController.js';
import upload from '../middleware/upload.js';
import User from '../models/User.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get all users (protected)
router.get('/all', protect, getAllUsers);

// Upload company logo
router.post(
    "/upload-company-logo/:id",
    protect,
    upload.single("companyLogo"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { companyLogo: req.file.path },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({
                message: "Company logo uploaded successfully",
                logoUrl: req.file.path,
                user: updatedUser
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Upload failed", error: err.message });
        }
    }
);

export default router;
