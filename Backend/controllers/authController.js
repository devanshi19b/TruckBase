import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      number,
      address,
      companyName,
      gstNumber,
      accountNumber,
      bankName
    } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Cloudinary file (company logo)
    const companyLogo = req.file?.path || null;

    const user = await User.create({
      name,
      email,
      password: hashed,
      number,
      address,
      companyName,
      companyLogo,
      gstNumber,
      accountNumber,
      bankName
    });

    return res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed", error: err });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    // Validate password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

// ---------------- GET PROFILE (PROTECTED) ----------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};
