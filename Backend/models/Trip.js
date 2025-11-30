// models/Trip.js
import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: { type: Date, default: Date.now },
  origin: { type: String, required: true },
  destination: { type: String, required: true },

  truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },

  biltyNumber: { type: String, required: true, unique: true },

  consignor: { type: String, required: true },
  consignorGstNumber: { type: String },

  consignee: { type: String, required: true },
  consigneeGstNumber: { type: String },

  goodsDescription: { type: String },
  weight: { type: Number, required: true },
  freight: { type: Number },
  advance: { type: Number },
  balance: { type: Number },

  privateMarka: { type: String },

  // Invoice Details
  invoiceNumber: { type: String },
  invoiceDate: { type: String },
  invoiceAmount: { type: Number },
  invoiceImage: { type: String },

  // E-Way Bill
  ewayBillNumber: { type: String },
  ewayBillImage: { type: String },

  // Payment
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Partial"], default: "Pending" },

  // Other documents uploaded
  documents: [{ type: String }],

  remarks: { type: String },
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
