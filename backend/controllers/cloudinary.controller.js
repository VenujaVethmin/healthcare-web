import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for handling multipart/form-data
const upload = multer({ dest: "uploads/" });

export const uploadImage = [
  upload.single("imageFormData"), // Accepts one file, 'imageFormData' must match Postman key
  async (req, res) => {
    try {
      const { file } = req;

      if (!file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
];
