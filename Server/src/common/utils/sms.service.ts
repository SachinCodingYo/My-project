/**
 * @author Aman kumar singh
 * @description
 */
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (
  to: string,
  message: string
) => {
  try {

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("SMS sent successfully");

  } catch (error) {
    console.error("SMS sending error:", error);
  }
};