// models/Bilty.js
import mongoose from "mongoose";

const biltySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },

  biltyNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },

  consignor: { type: String, required: true },
  consignorGstNumber: { type: String },

  consignee: { type: String, required: true },
  consigneeGstNumber: { type: String },

  origin: { type: String, required: true },
  destination: { type: String, required: true },

  truckNumber: { type: String, required: true },
  driverName: { type: String },
  driverPhone: { type: String },

  goodsDescription: { type: String },
  privateMarka: { type: String },

  packages: { type: String }, // optional: included because PDF referenced packages
  weight: { type: Number },
  freight: { type: Number },
  advance: { type: Number },
  balance: { type: Number },

  invoiceNumber: { type: String },
  invoiceDate: { type: String },
  invoiceAmount: { type: Number },

  ewayBillNumber: { type: String },

  invoiceImage: { type: String },
  ewayBillImage: { type: String },

  paymentStatus: { type: String, enum: ["Pending", "Paid", "Partial"], default: "Pending" },

  remarks: { type: String },
  fileUrl: { type: String }, // optional stored file (if you keep)
}, { timestamps: true });

export default mongoose.model("Bilty", biltySchema);
