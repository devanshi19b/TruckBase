import express from 'express';
import {
  addDriver,
  getAllDrivers,
  updateDriver,
  deleteDriver
} from '../controllers/driverController.js';

import upload from '../middleware/upload.js';
import Driver from '../models/Driver.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD routes
router.get("/all", protect, getAllDrivers);
router.get("/", protect, getAllDrivers)
router.post('/add', protect, addDriver);
router.put('/update/:id', protect, updateDriver);
router.delete('/delete/:id', protect, deleteDriver);

// Upload multiple driver documents
router.post(
  "/upload-driver-docs/:id",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "licence", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const driver = await Driver.findById(req.params.id);

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      const files = req.files;

      const updatedData = {
        photo: files.photo?.[0]?.path || driver.photo,
        aadhar: files.aadhar?.[0]?.path || driver.aadhar,
        pan: files.pan?.[0]?.path || driver.pan,
        licence: files.licence?.[0]?.path || driver.licence,
      };

      const updatedDriver = await Driver.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res.json({
        message: "Driver documents uploaded successfully",
        driver: updatedDriver
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export default router;
