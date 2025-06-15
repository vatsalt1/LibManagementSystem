// backend/utils/mail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

// Set SendGrid API key from .env (identical to CineInsight)
sgMail.setApiKey(process.env.API_KEY);

/**
 * Sends a one‐time password (OTP) email via SendGrid.
 * @param {string} toEmail – The recipient’s email address
 * @param {string} otpCode – The 6‑digit OTP string
 * @returns {Promise<object>} – The SendGrid response object
 */
export async function sendOtpEmail(toEmail, otpCode) {
  console.log(`→ [sendOtpEmail] Will send OTP '${otpCode}' to ${toEmail}`);

  // Construct the message in the same style as CineInsight
  const msg = {
    to: toEmail,
    from: process.env.EMAIL_USER, // Must be a verified sender in your SendGrid account
    subject: "Your OTP Code for Library Registration",
    text: `Your One‑Time Password (OTP) is ${otpCode}. Please enter this code to complete your registration.`,
    html: `<p>Your One‑Time Password (OTP) is <strong>${otpCode}</strong>.</p>
           <p>Please enter this code to complete your registration at our Library Management System.</p>`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("→ [sendOtpEmail] SendGrid response:", response);
    return response;
  } catch (error) {
    console.error("→ [sendOtpEmail] SendGrid FAILED to send OTP:", error);
    throw error;
  }
}
