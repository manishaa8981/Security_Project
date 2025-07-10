import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
export const createResetUrl = (token) => {
  return `${process.env.FRONT_PORT}/auth/reset-password/${token}`;
};

export const getPasswordResetTemplate = (resetUrl, appName, appLogo) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="background-color: #1a1a1a; color: white; font-family: Arial, sans-serif; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; background-color: #1a1a1a;">
    <img src="${appLogo}" alt=${appName} style="width: 100px; height: 100px; margin: 20px auto;">
    <h1 style="color: white; font-size: 24px; margin: 20px 0;">Let's reset your password</h1>
    <p style="color: white; font-size: 16px; margin: 20px 0;">All you have to do is click this button and we'll assist you securely reset your password</p>
    <div style="margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background-color: #ef4444; 
                color: white !important; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: bold;
                display: inline-block;">Reset Password</a>
    </div>
    <p style="color: #cccccc; margin: 20px 0; font-size: 14px;">NOTE: This link is valid for 15 minutes only.</p>
    <p style="color: white; font-size: 14px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
  </div>
</body>
</html>
`;

export const sendEmail = async ({ receiverEmail, subject, html }) => {
  try {
    // Create the email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Set up the mail options
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: receiverEmail,
      subject,
      html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email service failed");
  }
};

export const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
});
