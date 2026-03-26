import cloudinary from "../config/cloudinary.js";

export const uploadStreamVideo = async (filePath) => {

  const result = await cloudinary.uploader.upload(
    filePath,
    {
      resource_type: "video",
      folder: "flikkc_streams",
      streaming_profile: "hd"
    }
  );

  return result.secure_url;

};