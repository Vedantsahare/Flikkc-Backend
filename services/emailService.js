// services/emailService.js

import nodemailer from "nodemailer";

/* =========================
   Transporter Setup
========================= */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/* =========================
   Verify SMTP Connection
========================= */

transporter.verify((error) => {
  if (error) {
    console.error("SMTP connection failed:", error.message);
  } else {
    console.log("SMTP server is ready");
  }
});

/* =========================
   Send Email (Core)
========================= */

export async function sendEmail(to, subject, html) {
  try {
    if (!to || !subject || !html) {
      throw new Error("Missing email parameters");
    }

    await transporter.sendMail({
      from: `"Flikkc" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
}

/* =========================
   Verification Email
========================= */

export async function sendVerificationEmail(user, token) {
  try {
    const link = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Verify your Flikkc account</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${link}" style="color: blue;">Verify Email</a>
        <p>If you did not request this, ignore this email.</p>
      </div>
    `;

    await sendEmail(user.email, "Verify your account", html);

  } catch (error) {
    console.error("Verification email failed:", error.message);
  }
}

/* =========================
   Security Alert Email
========================= */

export async function sendSecurityAlert(user, message) {
  try {
    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h3>Security Alert</h3>
        <p>${message}</p>
      </div>
    `;

    await sendEmail(user.email, "Flikkc Security Alert", html);

  } catch (error) {
    console.error("Security alert email failed:", error.message);
  }
}