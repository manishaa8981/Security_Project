import mongoose from "mongoose";
export const distributionRightSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      required: false,
    },
    commissionRate: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
    },
    territories: [
      {
        type: String,
        required: false,
      },
    ],
    validFrom: {
      type: Date,
      required: false,
    },
    validUntil: {
      type: Date,
      required: false,
    },
  },
  { _id: false }
);
