import mongoose from "mongoose";
import { coordinatesSchema } from "../common/coordinateSchema.js";
export const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["HQ", "Branch"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      type: coordinatesSchema,
      required: true,
    },
  },
  { _id: false }
);
