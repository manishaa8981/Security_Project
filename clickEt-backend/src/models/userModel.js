import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MODERATOR", "EDITOR", "USER"],
      default: "USER",
    },
    profile_URL: {
      type: String,
      unique: true,
      default: null,
    },
    password_reset_Token: { type: String, default: null },
    password_reset_expiry: { type: Date, default: null },
    refresh_token: { type: String, default: null },
    refresh_token_expiry: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJWTToken = async function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || "1h",
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const refreshTokenExpiry =
    Date.now() +
    Number(process.env.JWT_REFRESH_EXPIRY || 7) * 24 * 60 * 60 * 1000;

  this.refresh_token = refreshTokenHash;
  this.refresh_token_expiry = refreshTokenExpiry;

  await this.save();

  return refreshToken;
};

userSchema.methods.generateRecoveryToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.password_reset_Token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.password_reset_expiry = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("users", userSchema);

export default User;
