// routes/tripRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { addTrip, getTrips, deleteTrip, updateTrip } from "../controllers/tripController.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  upload.fields([
    { name: "invoiceImage", maxCount: 1 },
    { name: "ewayBillImage", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  addTrip
);

router.get("/all", protect, getTrips);

router.delete("/delete/:id", protect, deleteTrip);

router.put(
  "/update/:id",
  protect,
  upload.fields([
    { name: "invoiceImage", maxCount: 1 },
    { name: "ewayBillImage", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  updateTrip
);

export default router;
