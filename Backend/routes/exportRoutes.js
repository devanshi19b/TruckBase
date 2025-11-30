import express from "express";
import { exportTrips } from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/trips", protect,  exportTrips);

export default router;