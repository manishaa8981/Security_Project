// src/utils/cookieUtil.js
import crypto from "crypto";
export function setTokenCookie(res, name, token) {
  res.cookie(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export const hashCrypto = (refreshToken) =>
  crypto.createHash("sha256").update(refreshToken).digest("hex");
