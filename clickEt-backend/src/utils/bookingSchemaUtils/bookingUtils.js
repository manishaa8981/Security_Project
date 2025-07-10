import { Booking } from "../../models/bookingModel.js";
import { Screening } from "../../models/screeningModel.js";

export const updateScreeningSeats = async (
  screeningId,
  seats,
  status,
  holdId = null,
  bookingId = null,
  holdExpiresAt = null
) => {
  const seatUpdates = seats.reduce((acc, { section, row, seatNumber }) => {
    acc[`seatGrid.${section}.rows.${row}.${seatNumber}`] = {
      code: status,
      holdExpiresAt: holdExpiresAt,
      holdId: holdId,
      bookingId: bookingId,
    };
    return acc;
  }, {});

  return await Screening.findOneAndUpdate(
    { _id: screeningId },
    {
      $set: seatUpdates,
      $inc: { version: 1 },
    },
    { new: true }
  );
};

export const cleanupExpiredHolds = async () => {
  try {
    // Find all expired holds
    const expiredHolds = await Booking.find({
      status: "held",
      holdExpiresAt: { $lt: new Date() },
    });

    // Process each expired hold
    for (const hold of expiredHolds) {
      // Revert seat states in the Screening model
      await revertSeatsToAvailable(hold.screeningId, hold.seats);

      // Delete the expired hold from the Booking model
      await Booking.findByIdAndDelete(hold._id);
      console.log("was called")
    }
  } catch (error) {
    console.error("Error cleaning up expired holds:", error);
  }
};

export const revertSeatsToAvailable = async (screeningId, seats) => {
  try {
    const screening = await Screening.findById(screeningId);

    if (!screening) {
      throw new Error("Screening not found");
    }

    // Update seat states to 'available'
    for (const seat of seats) {
      const { section, row, seatNumber } = seat;
      screening.seatGrid[section].rows[row][seatNumber].code = "a";
      screening.seatGrid[section].rows[row][seatNumber].holdExpiresAt = null;
      screening.seatGrid[section].rows[row][seatNumber].holdId = null;
      screening.seatGrid[section].rows[row][seatNumber].bookingId = null;
    }

    // Save the updated screening
    await screening.save();
  } catch (error) {
    console.error("Error reverting seats to available:", error);
  }
};
