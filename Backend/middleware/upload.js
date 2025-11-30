import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // resource_type: "auto" lets Cloudinary accept images and pdfs
    return {
      folder: `transport_system/${req.user ? String(req.user._id) : "public"}`,
      resource_type: "auto",
      public_id: `${file.fieldname}-${Date.now()}`,
      format: file.mimetype === "application/pdf" ? "pdf" : undefined,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (!file || !file.mimetype) {
    return cb(new Error("Invalid file"), false);
  }
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

export default upload;
