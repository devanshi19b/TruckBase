import Trip from "../models/Trip.js";
import Truck from "../models/Truck.js";
import Driver from "../models/Driver.js";
import Bilty from "../models/Bilty.js";
import mongoose from "mongoose";

export const getUnifiedDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Counts
    const totalTrucks = await Truck.countDocuments({ user: userId });
    const totalDrivers = await Driver.countDocuments({ user: userId });
    const totalTrips = await Trip.countDocuments({ user: userId });
    const totalBilties = await Bilty.countDocuments({ user: userId });

    // Revenue / Payment
    const trips = await Trip.find({ user: userId });

    const totalFreight = trips.reduce((sum, t) => sum + (t.freight || 0), 0);
    const totalAdvance = trips.reduce((sum, t) => sum + (t.advance || 0), 0);
    const totalBalance = trips.reduce((sum, t) => sum + (t.balance || 0), 0);

    const pendingPayments = trips
      .filter(t => t.paymentStatus.toLowerCase() === "pending")
      .reduce((sum, t) => sum + (t.freight || 0), 0);

    const completedTrips = await Trip.countDocuments({ user: userId, status: "Completed" });
    const pendingTrips = await Trip.countDocuments({ user: userId, status: "Pending" });

    const last7daysTrips = await Trip.countDocuments({
      user: userId,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // -------------------
    // Monthly Revenue (past 12 months)
    // -------------------
    const last12Months = await Trip.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalFreight: { $sum: "$freight" }
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalTrucks,
        totalDrivers,
        totalTrips,
        totalBilties,
        completedTrips,
        pendingTrips,
        last7daysTrips,
        revenue: {
          totalFreight,
          totalAdvance,
          totalBalance,
          pendingPayments
        },
        monthlyRevenue: last12Months,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard stats", error });
  }
};
