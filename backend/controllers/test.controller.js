import cron from "node-cron";
import { sendEmail } from "../lib/sendEmail.js";


export const test = async (req, res) => {
  try {
    const time = new Date("2025-04-22T14:18:00.000Z");
    const scheduledUTC = new Date(time.getTime() - 20 * 60 * 1000);
  

    let emailSent = false;

    cron.schedule("* * * * *", () => {
      const now = new Date();

      const match =
        now.getUTCFullYear() === scheduledUTC.getUTCFullYear() &&
        now.getUTCMonth() === scheduledUTC.getUTCMonth() &&
        now.getUTCDate() === scheduledUTC.getUTCDate() &&
        now.getUTCHours() === scheduledUTC.getUTCHours() &&
        now.getUTCMinutes() === scheduledUTC.getUTCMinutes();

      if (match && !emailSent) {
        console.log("⏰ Time matched! Sending email...");

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #3a99b7; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Appointment Reminder</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #eee;">
              <p style="font-size: 16px; color: #333;">Dear Venuja,</p>
              <p style="font-size: 16px; line-height: 1.5; color: #444;">
                This is a reminder for your upcoming appointment today.
              </p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #3a99b7; margin-top: 0;">Appointment Details:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 10px;">🗓️ Date: ${scheduledUTC.toLocaleDateString()}</li>
                  <li style="margin-bottom: 10px;">⏰ Time: 9:00 AM - 9:30 AM</li>
                  <li style="margin-bottom: 10px;">👨‍⚕️ Doctor: Dr. Smith</li>
                  <li style="margin-bottom: 10px;">📍 Location: Room 205</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
                Please arrive 5 minutes before your scheduled time.
              </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                If you need to reschedule, please contact us as soon as possible.
              </p>
            </div>
          </div>
        `;

        const textContent = `
          Dear Venuja,

          This is a reminder for your upcoming appointment today.

          Appointment Details:
          - Date: ${scheduledUTC.toLocaleDateString()}
          - Time: 9:00 AM - 9:30 AM
          - Doctor: Dr. Smith
          - Location: Room 205

          Please arrive 5 minutes before your scheduled time.

          If you need to reschedule, please contact us as soon as possible.
        `;

        sendEmail(
          "venujavethmin1234@gmail.com",
          "Your Appointment Today",
          textContent,
          htmlContent
        );

        emailSent = true;
      }
    });

    res.json({ message: "⏰ Email scheduled using UTC!" });
  } catch (error) {
    console.error("Error in scheduling:", error);
    res.status(500).json({ error: error.message });
  }
};
