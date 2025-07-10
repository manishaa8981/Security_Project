import mongoose from "mongoose";

export const moviesArchiveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    theatreName: {
      type: String,
      required: true,
    },
    distributor: {
      type: String,
      required: true,
    },
    hall: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seats: { type: [String], required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);
