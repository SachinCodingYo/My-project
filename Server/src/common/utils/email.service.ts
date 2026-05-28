/**
 * Email Utility Service
 *
 * This function sends an email using Nodemailer (Gmail SMTP).
 *
 * Author: Aman Kumar Singh
 * Purpose: Reusable email sender (used for OTP, notifications, etc.)
 */
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export const sendEsimQrEmail = async (
  to: string,
  firstName: string,
  planName: string,
  dataLimit: string,
  validityDays: number,
  countryCode: string,
  qrCodeBase64: string, // "data:image/png;base64,xxxx"
  lpaServer: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // extract data from base64 string
    const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, "");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Your eSIM is Ready! 🌍✈️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${firstName}, your eSIM is ready!</h2>
          
          <p>Here are your plan details:</p>
          <table>
            <tr><td><b>Plan</b></td><td>${planName}</td></tr>
            <tr><td><b>Data</b></td><td>${dataLimit}</td></tr>
            <tr><td><b>Validity</b></td><td>${validityDays} days</td></tr>
            <tr><td><b>Country</b></td><td>${countryCode}</td></tr>
          </table>

          <h3>Scan this QR code to activate your eSIM:</h3>
          
          <!-- inline image — cid:esimqr se refer kar rahe hain -->
          <img src="cid:esimqr" alt="eSIM QR Code" width="200" height="200"/>
          
          <h3>How to activate:</h3>
          <ol>
            <li>Go to phone Settings</li>
            <li>Mobile Data / SIM / eSIM</li>
            <li>Add eSIM → Scan QR code</li>
          </ol>

          <p>Can't scan? Enter this code manually:</p>
          <p style="background:#f4f4f4; padding:10px; word-break:break-all;">
            ${lpaServer}
          </p>

          <p>Enjoy your trip! ✈️</p>
        </div>
      `,
      attachments: [
        {
          filename: "esim-qr.png",
          content: base64Data,
          encoding: "base64",
          cid: "esimqr", // html mein src="cid:esimqr" se match karta hai
        },
      ],
    });

    console.log("[Email] eSIM QR email sent to:", to);
  } catch (error) {
    console.error("[Email] eSIM QR email error:", error);
  }
};
