import mongoose from "mongoose";
import { contactSchema } from "./fieldTypeSchemas/common/contactSchemas.js";
import { locationSchema } from "./fieldTypeSchemas/distributorSchemas/locationSchema.js";
import { distributionRightSchema } from "./fieldTypeSchemas/distributorSchemas/distributorRights.js";

const distributorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo_URL: {
      type: String,
      required: false,
      unique: true,
    },
    locations: [locationSchema],
    contacts: [contactSchema],
    commissionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    distributionRights: { type: [distributionRightSchema], required: false },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const Distributor = mongoose.model("distributors", distributorSchema);
