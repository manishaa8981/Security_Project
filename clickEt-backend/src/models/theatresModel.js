import mongoose from "mongoose";
import {
  commissionSchema,
  locationSchema,
} from "../models/fieldTypeSchemas/theatreSchemas/theatreSchemas.js";
import { contactSchema } from "./fieldTypeSchemas/common/contactSchemas.js";

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    locations: [locationSchema],
    commissionRate: [commissionSchema],
    contacts: [contactSchema],
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export const Theatre = mongoose.model("theatres", theatreSchema);
