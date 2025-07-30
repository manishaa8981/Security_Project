import crypto from "crypto";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import User from "../models/userModel.js";
// Send OTP to email
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const user = await User.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email is registered, OTP has been sent." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "If the email is registered, OTP has been sent." });
  } catch (error) {
    console.error("sendOTP error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 1. Check OTP
//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // 2. Generate reset token
//     const resetToken = await user.generateRecoveryToken();

//     // 3. Clear OTP fields
//     user.otp = null;
//     user.otpExpires = null;

//     await user.save({ validateBeforeSave: false });

//     // 4. Send token to frontend
//     return res.status(200).json({ resetToken }); // <- frontend needs this
//   } catch (error) {
//     console.error("verifyOTP error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpires = null;

  // ✅ Generate reset token and expiry
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.password_reset_Token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.password_reset_expiry = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    message: "OTP verified",
    resetToken, // ✅ This is what frontend needs
  });
};
