import crypto from "crypto";

export const verifyWebhook = (req, res, next) => {
  try {
    const signature = req.headers["x-webhook-signature"];

    if (!signature) {
      return res.status(401).json({ message: "Missing signature" });
    }

    const payload = req.rawBody;

    const expected = crypto
      .createHmac("sha256", process.env.WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );

    if (!isValid) {
      return res.status(401).json({ message: "Invalid webhook signature" });
    }

    next();

  } catch (error) {
    return res.status(500).json({ message: "Webhook verification failed" });
  }
};