// routes/biltyRoutes.js
import express from "express";
import {
  createBilty,
  getAllBilty,
  getBiltyById,
  deleteBilty,
  generateBiltyPDFController
} from "../controllers/biltyController.js";

import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import Trip from "../models/Trip.js";

const router = express.Router();


// create bilty from trip (protected)
router.post("/create", protect, createBilty);

// list all bilty for logged-in user
router.get("/all", protect, getAllBilty);

// get single bilty
router.get("/:id", protect, getBiltyById);

// download pdf
router.get("/pdf/:id", protect, generateBiltyPDFController);

// delete bilty
router.delete("/delete/:id", protect, deleteBilty);

// (optional) upload bilty image for a trip (stores image URL on Trip)
router.post(
  "/upload-bilty/:id",
  protect,
  upload.single("biltyImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const trip = await Trip.findByIdAndUpdate(
        req.params.id,
        { biltyImage: req.file.path },
        { new: true }
      );

      if (!trip) return res.status(404).json({ message: "Trip not found" });

      res.json({ message: "Bilty uploaded", trip });
    } catch (err) {
      console.error("upload-bilty error:", err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;
