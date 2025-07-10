// src/models/blackListedTokens.js
import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const BlacklistedToken = mongoose.model(
  "blacklistedToken",
  blacklistSchema
);
