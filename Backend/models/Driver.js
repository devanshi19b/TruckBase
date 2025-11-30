import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    photo: { type: String },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licence: { type: String },
    licenseExpiry: { type: Date },
    address: { type: String },
    aadharNumber: { type: String },
    aadhar: { type: String },
    pan: { type: String },
    remarks: { type: String }
}, { timestamps: true });

export default mongoose.model('Driver', driverSchema);
