import mongoose from 'mongoose';

const truckSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    truckNumber: { type: String, required: true, unique: true },
    truckType: { type: String, required: true },
    capacity: { type: Number, required: true },
    truckImage: { type: String },
}, { timestamps: true });

export default mongoose.model('Truck', truckSchema);
