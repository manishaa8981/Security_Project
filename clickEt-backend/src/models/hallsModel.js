import mongoose from "mongoose";

const seatSectionSchema = new mongoose.Schema(
  {
    rows: {
      type: Number,
      required: true,
      min: 1,
    },
    columns: {
      type: Number,
      required: true,
      min: 1,
    },
    startRow: {
      type: String,
      required: true,
      default: "A",
    },
    startNumber: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false }
);


const hallSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theatres",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    layout: {
      sections: [seatSectionSchema],
    },
    totalSeats: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Hall = mongoose.model("halls", hallSchema);