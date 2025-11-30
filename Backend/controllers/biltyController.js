// controllers/biltyController.js
import Bilty from '../models/Bilty.js';
import Trip from '../models/Trip.js';
import generateBiltyPDF from '../utils/generateBiltyPDF.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname as _dirname } from 'path';

// note: __dirname polyfill for ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = _dirname(__filename);

// Create Bilty from Trip
export const createBilty = async (req, res) => {
  try {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ message: "tripId required" });

    const trip = await Trip.findById(tripId).populate("truck").populate("driver");
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Create unique biltyNumber if trip doesn't have one
    const generateBiltyNumber = () => `B-${Date.now()}`;
    const biltyNumber = trip.biltyNumber || generateBiltyNumber();

    const biltyData = {
      user: trip.user,
      trip: trip._id,
      biltyNumber,
      consignor: trip.consignor,
      consignorGstNumber: trip.consignorGstNumber || "",
      consignee: trip.consignee,
      consigneeGstNumber: trip.consigneeGstNumber || "",
      origin: trip.origin,
      destination: trip.destination,
      truckNumber: trip.truck?.truckNumber || "N/A",
      driverName: trip.driver?.name || "N/A",
      driverPhone: trip.driver?.phone || "N/A",
      goodsDescription: trip.goodsDescription,
      privateMarka: trip.privateMarka,
      packages: trip.packages || "",
      weight: trip.weight,
      freight: trip.freight,
      advance: trip.advance,
      balance: trip.balance,
      invoiceNumber: trip.invoiceNumber,
      invoiceDate: trip.invoiceDate,
      invoiceAmount: trip.invoiceAmount,
      invoiceImage: trip.invoiceImage,
      ewayBillNumber: trip.ewayBillNumber,
      ewayBillImage: trip.ewayBillImage,
      paymentStatus: trip.paymentStatus,
      remarks: trip.remarks,
    };

    const bilty = await Bilty.create(biltyData);
    res.status(201).json(bilty);
  } catch (error) {
    console.error("createBilty error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all bilty for logged-in user
export const getAllBilty = async (req, res) => {
  try {
    // FIX: define userId from req.user (protect middleware must have set this)
    const userId = req.user.id;

    const bilty = await Bilty.find({ user: userId }).populate("trip");
    res.json(bilty);
  } catch (error) {
    console.error("getAllBilty error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single bilty by id
export const getBiltyById = async (req, res) => {
  try {
    const bilty = await Bilty.findById(req.params.id).populate("trip");
    if (!bilty) return res.status(404).json({ message: "Bilty not found" });
    res.json(bilty);
  } catch (error) {
    console.error("getBiltyById error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete bilty
export const deleteBilty = async (req, res) => {
  try {
    const bilty = await Bilty.findByIdAndDelete(req.params.id);
    if (!bilty) return res.status(404).json({ message: "Bilty not found" });
    res.json({ message: "Bilty deleted successfully" });
  } catch (error) {
    console.error("deleteBilty error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Generate Bilty PDF and download
export const generateBiltyPDFController = async (req, res) => {
  try {
    const { id } = req.params;
    const bilty = await Bilty.findById(id).populate('user');
    if (!bilty) return res.status(404).json({ message: "Bilty not found" });

    // ensure uploads directory exists
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const fileName = `bilty-${bilty.biltyNumber || bilty._id}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    // Prepare data for PDF generator
    const transportName = bilty.user?.companyName || "TRANSPORT COMPANY";
    const biltyData = { ...bilty._doc, transportName };

    await generateBiltyPDF(biltyData, filePath);

    // set headers and stream file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const filestream = fs.createReadStream(filePath);
    filestream.pipe(res);

    filestream.on('end', () => {
      fs.unlink(filePath, err => { if (err) console.error('Failed to delete temp PDF:', err); });
    });

    filestream.on('error', err => {
      console.error('File stream error:', err);
      res.status(500).end();
    });

  } catch (error) {
    console.error("generateBiltyPDFController error:", error);
    res.status(500).json({ message: error.message });
  }
};
