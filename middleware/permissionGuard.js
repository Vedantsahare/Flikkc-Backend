import { ADMIN_PERMISSIONS } from "../config/adminPermissions.js";

const permissionGuard = (permission) => {

  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const rolePermissions = ADMIN_PERMISSIONS[req.user.role];

    if (!rolePermissions || !rolePermissions.includes(permission)) {
      return res.status(403).json({
        message: "Permission denied"
      });
    }

    next();

  };

};

export default permissionGuard;