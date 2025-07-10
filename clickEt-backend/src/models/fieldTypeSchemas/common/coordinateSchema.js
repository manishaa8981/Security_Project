import mongoose from "mongoose";

export const coordinatesSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);
