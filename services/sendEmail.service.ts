import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
const apiKey = process.env.APIKey || "";

async function sendSimpleMessage(email:any,code:any) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: apiKey,

  });
  try {
    const data = await mg.messages.create("sandboxf9882a12912f405f9ea3a24d0155114f.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandboxf9882a12912f405f9ea3a24d0155114f.mailgun.org>",
to: [email],
      subject: "Password Reset Request - SmartBiz",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please use the following verification code:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>SmartBiz Team</p>
        </div>
      `,
      text: `Hello,\n\nYou requested to reset your password. Your verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nSmartBiz Team`
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

export default {
  sendSimpleMessage,
};