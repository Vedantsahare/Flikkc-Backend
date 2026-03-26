

const DISCORD_WEBHOOK = process.env.ADMIN_ALERT_WEBHOOK;

export const sendAdminAlert = async (message) => {
  if (!DISCORD_WEBHOOK) {
    console.warn("Admin webhook not configured");
    return;
  }

  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: message
      })
    });
  } catch (error) {
    console.error("Alert failed", error.message);
  }
};