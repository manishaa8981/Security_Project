import qrcode from "qrcode";
import speakeasy from "speakeasy";
import User from "../models/userModel.js";

export async function setupTOTP(req, res) {
  try {
    let user;

    // Allow either token-authenticated or userId-based access
    if (req.user) {
      user = req.user;
    } else if (req.query.userId) {
      user = await User.findById(req.query.userId);
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // If already has a secret, do not regenerate
    if (user.mfa_secret) {
      return res.status(400).json({ message: "MFA already set up" });
    }

    const secret = speakeasy.generateSecret({
      name: `BookEt (${user.email})`,
    });

    user.mfa_secret = secret.base32;
    await user.save({ validateBeforeSave: false });

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ message: "QR generation failed" });

      res.status(200).json({
        message: "Scan the QR code with your authenticator app",
        qrCode: data_url,
      });
    });
  } catch (err) {
    console.error("QR Setup Error:", err.message);
    res.status(500).json({ message: "Server error during QR setup" });
  }
}

export async function verifyTOTP(request, response) {
  const user = request.user;
  const { token } = request.body;

  const verified = speakeasy.totp.verify({
    secret: user.mfa_secret,
    encoding: "base32",
    token,
    window: 1, // allows ±1 step for time drift
  });

  if (!verified) {
    return response
      .status(401)
      .json({ message: "Invalid or expired 2FA code" });
  }

  // response.status(200).json({ message: "TOTP verified successfully" });
  // On success, return access tokens
  const accessToken = await user.generateJWTToken();
  const refreshToken = await user.generateRefreshToken();
  setTokenCookie(res, "access_token", accessToken);
  setTokenCookie(res, "refresh_token", refreshToken);

  return res.status(200).json({
    message: "TOTP verified",
    accessToken,
    refreshToken,
  });
}
