import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    number: { type: String},
    address: { type: String},
    companyName: { type: String},
    companyLogo: { type: String },
    gstNumber: { type: String},
    accountNumber: { type: String},
    bankName: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);