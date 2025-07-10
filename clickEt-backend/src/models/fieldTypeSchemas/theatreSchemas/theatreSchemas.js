import { coordinatesSchema } from "../common/coordinateSchema.js";
import mongoose from "mongoose";
export const locationSchema = new mongoose.Schema(
  {
    address: {
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
export const commissionSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    rate: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  { _id: false }
);
