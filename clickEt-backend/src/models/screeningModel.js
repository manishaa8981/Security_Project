import mongoose from "mongoose";

const screeningSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      required: true,
    },
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "distributors",
      required: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theatres",
      required: true,
    },
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "halls",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    // Seat management using the 2D grid approach
    seatGrid: [
      {
        section: Number,
        rows: [
          [
            {
              code: {
                type: String,
                enum: ["a", "h", "r"], // available, hold, reserved
                default: "a",
              },
              holdExpiresAt: {
                type: Date,
                default: null,
              },
              holdId: {
                type: String,
                default: null,
              },
              bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "bookings",
                default: null,
              },
            },
          ],
        ],
      },
    ],
    version: {
      // For optimistic locking
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

screeningSchema.pre('save', async function(next) {
  const now = new Date();
  this.seatGrid.forEach(section => {
    section.rows.forEach(row => {
      row.forEach(seat => {
        if (seat.code === 'h' && seat.holdExpiresAt && seat.holdExpiresAt < now) {
          seat.code = 'a';
          seat.holdExpiresAt = null;
          seat.holdId = null;
        }
      });
    });
  });
  next();
});

export const Screening = mongoose.model("screenings", screeningSchema);
