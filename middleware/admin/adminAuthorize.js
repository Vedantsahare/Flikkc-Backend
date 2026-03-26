import { ADMIN_PERMISSIONS } from "../../config/adminPermissions.js";

export const authorizeAdmin = (requiredPermission) => {
  return (req, res, next) => {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const permissions = ADMIN_PERMISSIONS[admin.role] || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Insufficient permission"
      });
    }

    next();
  };
};