import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modeOfPayment: {
      type: String,
      enum: ["KHALTI"],
      required: true,
    },
    screeningId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screening",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
    pidx: {
      type: String,
    },
    date: { type: Date, required: true },
    time: { type: Date, required: true },
    amount: { type: Number, required: true },
    refundState: {
      type: String,
      enum: [null, "INIT", "PENDING", "SUCCESSFUL", "REFUNDED"],
      default: null,
    },
    refundReason: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("payments", paymentSchema);