import Driver from "../models/Driver.js";

// Add a new driver
export const addDriver = async (req, res) => {
  try {
    const { phone, licenseNumber, aadharNumber, name, address, remarks } = req.body;
    const userId = req.user.id; // Get logged-in user from JWT

    // Prevent duplicate entries for the same user
    const duplicate = await Driver.findOne({
      user: userId,
      $or: [{ phone }, { licenseNumber }, { aadharNumber }]
    });

    if (duplicate) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    const driver = await Driver.create({
      user: userId,
      name,
      phone,
      licenseNumber,
      aadharNumber,
      address,
      remarks
    });

    res.status(201).json({ message: "Driver added successfully", driver });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get drivers belonging ONLY to logged-in user
export const getAllDrivers = async (req, res) => {
  try {
    const userId = req.user.id;

    const drivers = await Driver.find({ user: userId }).select("-aadharNumber");
    res.status(200).json(drivers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a driver
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Driver updated", driver });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a driver
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Driver deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
