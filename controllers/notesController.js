import Note from "../models/Note.js"; // Correct import
import tesseract from "tesseract.js"; // Correct Tesseract import
import cloudinary from "../config/cloudinaryConfig.js"; // Cloudinary uploader

export async function uploadNotes(req, res) {
  try {
    const filePath = req.file.path;

    // Upload file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
    });

    // Extract text using Tesseract
    const { data: { text } } = await tesseract.recognize(filePath, "eng");

    // Save to MongoDB
    const note = await Note.create({
      userId: "defaultUser",
      fileName: req.file.originalname,
      fileUrl: cloudinaryResponse.url,
      extractedText: text,
    });

    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
