import express from "express";
import { getUnifiedDashboardStats } from "../controllers/dashboardAnalyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Single route for all dashboard + analytics stats
router.get("/stats", protect, getUnifiedDashboardStats);

export default router;
