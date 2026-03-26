import cloudinary from "../config/cloudinary.js";

export const uploadAvatar = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "flikkc_profiles" },
      (error, result) => {

        if (error) {
          return res.status(500).json({ message: "Upload failed" });
        }

        res.json({
          success: true,
          url: result.secure_url
        });

      }
    );

    stream.end(req.file.buffer);

  } catch (error) {

    res.status(500).json({ message: "Upload failed" });

  }

};