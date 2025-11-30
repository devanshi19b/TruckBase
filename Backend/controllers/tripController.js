// controllers/tripController.js
import Trip from "../models/Trip.js";

const fileUrl = (file) => {
  // multer-storage-cloudinary typically returns 'path' property; some versions include 'secure_url' or 'url'
  return file?.path || file?.secure_url || file?.url || "";
};

const requireFields = (body, fields) => {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === "");
  return missing;
};

export const addTrip = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // files: invoiceImage (1), ewayBillImage (1), documents (multiple)
    const files = req.files || {};

    const invoiceImage = files.invoiceImage?.[0] ? fileUrl(files.invoiceImage[0]) : "";
    const ewayBillImage = files.ewayBillImage?.[0] ? fileUrl(files.ewayBillImage[0]) : "";
    const documents = (files.documents || []).map((f) => fileUrl(f)).filter(Boolean);

    // Build tripData and coerce numbers
    const tripData = {
      user: userId,
      date: req.body.date ? new Date(req.body.date) : Date.now(),
      origin: (req.body.origin || "").trim(),
      destination: (req.body.destination || "").trim(),
      truck: req.body.truck,
      driver: req.body.driver,
      biltyNumber: (req.body.biltyNumber || "").trim(),
      consignor: (req.body.consignor || "").trim(),
      consignorGstNumber: req.body.consignorGstNumber || "",
      consignee: (req.body.consignee || "").trim(),
      consigneeGstNumber: req.body.consigneeGstNumber || "",
      goodsDescription: req.body.goodsDescription || req.body.material || "",
      weight: req.body.weight !== undefined && req.body.weight !== "" ? Number(req.body.weight) : undefined,
      freight: req.body.freight !== undefined && req.body.freight !== "" ? Number(req.body.freight) : undefined,
      advance: req.body.advance !== undefined && req.body.advance !== "" ? Number(req.body.advance) : undefined,
      balance: req.body.balance !== undefined && req.body.balance !== "" ? Number(req.body.balance) : undefined,
      privateMarka: req.body.privateMarka || "",
      invoiceNumber: req.body.invoiceNumber || "",
      invoiceDate: req.body.invoiceDate || "",
      invoiceAmount: req.body.invoiceAmount !== undefined && req.body.invoiceAmount !== "" ? Number(req.body.invoiceAmount) : undefined,
      invoiceImage,
      ewayBillNumber: req.body.ewayBillNumber || "",
      ewayBillImage,
      documents,
      remarks: req.body.remarks || "",
      paymentStatus: req.body.paymentStatus || "Pending",
    };

    // Validate required fields (explicit)
    const missing = requireFields(tripData, [
      "origin", "destination", "truck", "driver", "biltyNumber", "consignor", "consignee", "weight"
    ]);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(", ")}` });
    }

    const trip = new Trip(tripData);
    await trip.save();

    return res.status(201).json({ success: true, message: "Trip added successfully", trip });
  } catch (error) {
    console.error("addTrip error:", error);
    if (error.code === 11000 && error.keyPattern?.biltyNumber) {
      return res.status(400).json({ success: false, message: "Bilty number already exists" });
    }
    return res.status(500).json({ success: false, message: "Server error while adding trip", error: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const trips = await Trip.find({ user: userId }).populate("truck").populate("driver").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error("getTrips error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    if (trip.user.toString() !== userId.toString()) return res.status(403).json({ success: false, message: "Forbidden" });

    await Trip.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("deleteTrip error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    if (trip.user.toString() !== userId.toString()) return res.status(403).json({ success: false, message: "Forbidden" });

    const files = req.files || {};
    const invoiceImage = files.invoiceImage?.[0] ? fileUrl(files.invoiceImage[0]) : trip.invoiceImage || "";
    const ewayBillImage = files.ewayBillImage?.[0] ? fileUrl(files.ewayBillImage[0]) : trip.ewayBillImage || "";
    const newDocuments = (files.documents || []).map((f) => fileUrl(f)).filter(Boolean);

    const updateData = {
      date: req.body.date ? new Date(req.body.date) : trip.date,
      origin: req.body.origin ?? trip.origin,
      destination: req.body.destination ?? trip.destination,
      truck: req.body.truck ?? trip.truck,
      driver: req.body.driver ?? trip.driver,
      biltyNumber: req.body.biltyNumber ?? trip.biltyNumber,
      consignor: req.body.consignor ?? trip.consignor,
      consignorGstNumber: req.body.consignorGstNumber ?? trip.consignorGstNumber,
      consignee: req.body.consignee ?? trip.consignee,
      consigneeGstNumber: req.body.consigneeGstNumber ?? trip.consigneeGstNumber,
      goodsDescription: req.body.goodsDescription ?? trip.goodsDescription,
      weight: req.body.weight !== undefined && req.body.weight !== "" ? Number(req.body.weight) : trip.weight,
      freight: req.body.freight !== undefined && req.body.freight !== "" ? Number(req.body.freight) : trip.freight,
      advance: req.body.advance !== undefined && req.body.advance !== "" ? Number(req.body.advance) : trip.advance,
      balance: req.body.balance !== undefined && req.body.balance !== "" ? Number(req.body.balance) : trip.balance,
      privateMarka: req.body.privateMarka ?? trip.privateMarka,
      invoiceNumber: req.body.invoiceNumber ?? trip.invoiceNumber,
      invoiceDate: req.body.invoiceDate ?? trip.invoiceDate,
      invoiceAmount: req.body.invoiceAmount !== undefined && req.body.invoiceAmount !== "" ? Number(req.body.invoiceAmount) : trip.invoiceAmount,
      invoiceImage,
      ewayBillNumber: req.body.ewayBillNumber ?? trip.ewayBillNumber,
      ewayBillImage,
      remarks: req.body.remarks ?? trip.remarks,
      paymentStatus: req.body.paymentStatus ?? trip.paymentStatus,
    };

    // append new documents if any
    updateData.documents = [ ...(trip.documents || []), ...newDocuments ];

    const updated = await Trip.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.status(200).json({ success: true, message: "Trip updated", trip: updated });
  } catch (error) {
    console.error("updateTrip error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
