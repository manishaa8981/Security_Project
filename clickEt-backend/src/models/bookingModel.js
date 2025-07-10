// src/models/bookingModel.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    screeningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "screenings",
      required: true,
    },
    seats: [
      {
        section: Number,
        row: Number,
        seatNumber: Number,
        seatId:String
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["held", "confirmed", "cancelled"],
      default: "held",
    },
    holdExpiresAt: {
      type: Date,
      default: null,
    },
    holdId: {
      type: String,
      default: null,
    },
    paymentInfo: {
      transactionId: String,
      paymentMethod: String,
      paidAmount: Number,
      paidAt: Date
    },
    confirmationDetails: {
      confirmedAt: Date,
      confirmationCode: String
    }
  },
  { timestamps: true }
);

// Automatically expire holds
bookingSchema.index({ holdExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const Booking = mongoose.model("bookings", bookingSchema);