
import UserActivity from "../models/UserActivity.js";

export async function logActivity(userId, action, metadata = {}) {

  try {

    await UserActivity.create({
      user: userId,
      action,
      metadata,
      createdAt: new Date()
    });

  } catch (error) {

    console.error("Activity log failed:", error);

  }

}

