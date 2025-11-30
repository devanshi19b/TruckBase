import Truck from '../models/Truck.js';

// Add a new truck
export const addTruck = async (req, res) => {
    try {
        console.log("Incoming Truck Body:", req.body);
        const truck = await Truck.create(req.body);
        res.status(201).json(truck);
    } catch (error) {
        console.log("Add Truck Error:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Truck number already exists" });
        }

        res.status(500).json({ message: error.message });
    }
};

// Get all trucks
export const getAllTrucks = async (req, res) => {
    try {
        const trucks = await Truck.find();
        res.json(trucks);
    } catch (error) {
        console.log("Get Trucks Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update a truck
export const updateTruck = async (req, res) => {
    try {
        const truck = await Truck.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!truck) return res.status(404).json({ message: 'Truck not found' });

        res.json(truck);
    } catch (error) {
        console.log("Update Truck Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete truck
export const deleteTruck = async (req, res) => {
    try {
        const truck = await Truck.findByIdAndDelete(req.params.id);

        if (!truck) return res.status(404).json({ message: 'Truck not found' });

        res.json({ message: 'Truck deleted successfully' });
    } catch (error) {
        console.log("Delete Truck Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Upload Truck Image
export const uploadTruckImage = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });

        const truck = await Truck.findByIdAndUpdate(
            req.params.id,
            { truckImage: req.file.secure_url },
            { new: true }
        );

        if (!truck) return res.status(404).json({ message: "Truck not found" });

        res.json({
            message: "Truck image uploaded successfully",
            truck,
        });

    } catch (err) {
        console.log("Upload Image Error:", err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
};
