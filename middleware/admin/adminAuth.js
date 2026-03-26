import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Admin token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: enforce token type
    if (decoded.type !== "ADMIN") {
      return res.status(403).json({
        message: "Invalid admin token"
      });
    }

    const admin = await Admin.findById(decoded.id).select(
      "_id role isActive"
    );

    if (!admin || !admin.isActive) {
      return res.status(403).json({
        message: "Admin access denied"
      });
    }

    req.admin = {
      id: admin._id,
      role: admin.role
    };

    next();

  } catch (error) {
    console.error("Admin auth error:", error);

    res.status(401).json({
      message: "Invalid admin token"
    });
  }
};