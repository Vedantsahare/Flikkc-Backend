import AdminAuditLog from "../../models/admin/AdminAuditLog.js";

export const logAdminAction = async ({
  adminId,
  action,
  targetType,
  targetId,
  details = {},
  req
}) => {
  try {
    await AdminAuditLog.create({
      adminId,
      action,
      targetType,
      targetId,
      details,
      ipAddress: req?.ip
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};