// src/controller/authController.js
import axios from "axios";
import User from "../models/userModel.js";
import { hashCrypto, setTokenCookie } from "../utils/cookieUtil.js";
import {
  createResetUrl,
  getPasswordResetTemplate,
  sendEmail,
} from "../utils/emailUtils.js";
import {
  deleteImageFromCloudinary,
  processAndUploadImages,
} from "../utils/imageUtils/cloudinaryUtils.js";
import { validatePasswordPolicy } from "../utils/securityUtils/validatePassword.js";
import { getUserIdFromToken, isValidObjectId } from "../utils/tokenUtils.js";
import crypto from "crypto";


export async function initRegistration(request, response) {
  const registrationCredentials = request.body;
  //  Validate password policy
  const { valid, errors } = validatePasswordPolicy(
    registrationCredentials.password
  );
  if (!valid) {
    return response.status(400).json({
      message: "Password does not meet security requirements.",
      errors,
    });
  }
  try {
    const user = await User.create(registrationCredentials);

    const accessToken = await user.generateJWTToken();
    const refreshToken = await user.generateRefreshToken();
    setTokenCookie(response, "access_token", accessToken);
    setTokenCookie(response, "refresh_token", refreshToken);

    user.password = undefined;

    return response.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error(`Registration Error:${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function initAuthentication(request, response) {
  const { user_name, password, captchaToken } = request.body;
  //  1. CAPTCHA must be verified before anything else
  if (!captchaToken) {
    return response.status(400).json({ message: "CAPTCHA token missing" });
  }
  const secretKey = process.env.RECAPTCHA_SECRET;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const captchaRes = await axios.post(verifyUrl, null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET,
        response: captchaToken,
      },
    });

    if (!captchaRes.data.success) {
      return response
        .status(403)
        .json({ message: "CAPTCHA verification failed" });
    }
  } catch (captchaError) {
    console.error("CAPTCHA Error:", captchaError.message);
    return response.status(500).json({ message: "Failed to verify CAPTCHA" });
  }

  try {
    //  2. Find user
    const user = await User.findOne({
      $or: [{ user_name }, { email: user_name }],
    });

    if (!user) {
      return response
        .status(404)
        .json({ message: "Invalid Account credentials" });
    }

    if (user.isLocked()) {
      return response.status(423).json({
        message:
          "Account temporarily locked due to multiple failed attempts. Try again later.",
      });
    }

    //  3. Verify password
    const authResult = await user.comparePassword(password);
    if (!authResult) {
      await user.incrementLoginAttempts();
      return response.status(401).json({ message: "Invalid Password" });
    }

    await user.resetLoginAttempts(); // reset on success

    //  4. MFA Check
    if (user.mfa_enabled) {
      return response.status(206).json({
        message: "TOTP Required",
        mfaRequired: true,
        userId: user._id.toString(),
      });
    }

    // Record login timestamp
    user.loginTimestamps = user.loginTimestamps || [];
    user.loginTimestamps.push(new Date());
    await user.save();
    //  5. Issue tokens
    const accessToken = await user.generateJWTToken();
    const refreshToken = await user.generateRefreshToken();

    setTokenCookie(response, "refresh_token", refreshToken);
    setTokenCookie(response, "access_token", accessToken);

    return response.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(`Authentication Error: ${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function initTokenRefresh(request, response) {
  const refreshToken = request.cookies.refresh_token;

  if (!refreshToken) {
    return response.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const refreshTokenHash = hashCrypto(refreshToken);
    const user = await User.findOne({ refresh_token: refreshTokenHash });

    if (!user) {
      return response.status(404).json({ message: "Invalid refresh token" });
    }

    // Check if the refresh token is expired
    if (Date.now() > user.refresh_token_expiry) {
      return response
        .status(400)
        .json({ message: "Refresh token has expired" });
    }

    const newAccessToken = await user.generateJWTToken();
    const newRefreshToken = await user.generateRefreshToken();
    setTokenCookie(response, "access_token", newAccessToken);
    setTokenCookie(response, "refresh_token", newRefreshToken);

    return response.status(200).json({
      message: "Access and Refresh tokens refreshed.",
    });
  } catch (error) {
    console.error(`Refresh Token Error: ${error.message}`);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendResetEmail(request, response) {
  const { email } = request.body;

  const user = await User.findOne({ email });
  if (!user) {
    return response.status(200).json({
      success: true,
      message:
        "If your'e a registered user, please check your inbox for password reset instructions.",
    });
  }

  // 2. Generate reset token
  const resetToken = await user.generateRecoveryToken();
  await user.save({ validateBeforeSave: false });
  user.password = undefined;

  // 3. Create reset URL
  const resetUrl = createResetUrl(resetToken);
  const emailTemplate = getPasswordResetTemplate(
    resetUrl,
    process.env.APP_NAME,
    process.env.APP_LOGO_URL
  );
  try {
    // 5. Send reset email
    await sendEmail({
      receiverEmail: user.email,
      subject: "Password Reset Request",
      html: emailTemplate,
    });

    // 6. Send success response
    response.status(200).json({
      success: true,
      message:
        "If your email is registered, you'll receive password reset instructions.",
    });
  } catch (error) {
    // 7. Handle email sending failure
    user.password_reset_Token = null;
    user.password_reset_expiry = null;
    await user.save({ validateBeforeSave: false });

    console.error(500, "Email could not be sent");
  }
}

// export async function resetPassword(request, response) {
//   const { token, password } = request.body;

//   const hashedToken = hashCrypto(token);

//   const user = await User.findOne({
//     password_reset_Token: hashedToken,
//     password_reset_expiry: { $gt: Date.now() },
//   });

//   if (!user) {
//     return response.status(401).json({
//       message: "Invalid or Expired reset link",
//     });
//   }

//   //  Check password reuse BEFORE updating the user password field
//   const isReused = user.password_history.some((oldHash) =>
//     bcrypt.compareSync(password, oldHash)
//   );

//   if (isReused) {
//     return response.status(400).json({
//       message: "You cannot reuse a recent password. Please choose a new one.",
//     });
//   }

//   //  Now assign and update password + reset token fields
//   user.password = password;
//   user.password_reset_Token = null;
//   user.password_reset_expiry = null;

//   await user.save();

//   return response.status(200).json({
//     success: true,
//     message: "Password reset successful",
//   });
// }
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Hash the token before lookup
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      password_reset_Token: hashedToken,
      password_reset_expiry: { $gt: Date.now() }, // Not expired
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    user.password_reset_Token = undefined;
    user.password_reset_expiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export async function initAuthStatus(request, response) {
  try {
    const token = request.cookies.access_token;
    if (!token) {
      return response.status(401).json({ message: "Token not available" });
    }

    const userId = getUserIdFromToken(token);

    // Validate the decoded ID
    if (!isValidObjectId(userId)) {
      return response.status(401).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select(
      "-_id -phone_number -password -refresh_token -refresh_token_expiry -password_reset_Token -password_reset_expiry"
    );
    if (!user) {
      return response.status(401).json({ message: "User doesn't exist" });
    }

    response
      .status(200)
      .json({ message: "User successfully fetched", user: user });
  } catch (error) {
    response
      .status(401)
      .json({ message: "Internal Server Error", error: error });
  }
}

export function initLogOut(request, response) {
  try {
    // Clear the access and refresh tokens from cookies
    response.clearCookie("access_token");
    response.clearCookie("refresh_token");

    return response.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(`Logout Error: ${error.message}`);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}
export async function checkExistingAuthCredentials(request, response) {
  const { user_name, email } = request.body;

  try {
    const existingUsers = await User.find({
      $or: [{ user_name }, { email: user_name }],
    });

    const credentialConflicts = {
      user_name: false,
      email: false,
    };

    if (existingUsers.length > 0) {
      existingUsers.forEach((user) => {
        if (user.email === email) {
          credentialConflicts.email = true;
        }
        if (user.user_name === user_name) {
          credentialConflicts.user_name = true;
        }
      });

      return response.status(409).json({
        message: "Credentials already in use",
        usedCredentials: credentialConflicts,
      });
    }
  } catch (error) {
    console.error(`Credentials Validation Error: ${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error. Check console for details" });
  }
}

export async function listAllUsers(request, response) {
  try {
    const users = await User.find({});
    // Expose loginTimestamps in the response
    const usersWithLogins = users.map((u) => ({
      _id: u._id,
      full_name: u.full_name,
      user_name: u.user_name,
      email: u.email,
      phone_number: u.phone_number,
      role: u.role,
      profile_URL: u.profile_URL,
      loginTimestamps: u.loginTimestamps || [],
    }));
    return response.status(200).json({ users: usersWithLogins });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteUser(request, response) {
  try {
    const { user_name } = request.params;

    const user = await User.findOneAndDelete({ user_name });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    return response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Delete User Error: ${error.message}`);
    return response
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function uploadProfileImage(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const userId = getUserIdFromToken(token);
    if (!isValidObjectId(userId)) {
      return res.status(401).json({ message: "Invalid user ID" });
    }

    // Ensure file is uploaded
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Check image size limit (e.g., 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(413).json({ message: "File too large (max 2MB)" });
    }

    // Validate MIME type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(415).json({ message: "Unsupported image type" });
    }

    // Upload new image
    const [imageUrl] = await processAndUploadImages(
      [req.file.buffer],
      "profileImages"
    );

    // Delete old image (only if user owns it)
    if (req.body.currentImageUrl) {
      const user = await User.findById(userId);
      if (user?.profile_URL === req.body.currentImageUrl) {
        await deleteImageFromCloudinary(req.body.currentImageUrl);
      }
    }

    // Save new profile image URL
    await User.findByIdAndUpdate(userId, { profile_URL: imageUrl });

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      profile_URL: imageUrl,
    });
  } catch (err) {
    console.error(" Image upload failed:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserProfile(request, response) {
  try {
    const user = await User.findById(request.user.id).select("-password");
    if (!user) return response.status(404).json({ message: "User not found" });
    // Expose loginTimestamps in the response
    const userObj = user.toObject();
    userObj.loginTimestamps = user.loginTimestamps || [];
    response.status(200).json(userObj);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
