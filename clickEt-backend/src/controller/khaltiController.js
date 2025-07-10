import axios from "axios";
import { Booking } from "../models/bookingModel.js";
import { Payment } from "../models/paymentsModel.js";
import { Screening } from "../models/screeningModel.js";
import { getUserIdFromToken, isValidObjectId } from "../utils/tokenUtils.js";

const paymentLocks = new Map();

export const khaltiController = {
  initiatePayment: async (request, response) => {
    try {
      const { holdId, returnUrl } = request.body;
      const token = request.cookies.access_token;

      if (!token) {
        return response.status(401).json({ message: "Token not available" });
      }

      const userId = getUserIdFromToken(token);

      if (!isValidObjectId(userId)) {
        return response.status(401).json({ message: "Invalid user ID" });
      }

      const booking = await Booking.findOne({
        holdId,
        userId,
        status: "held",
        holdExpiresAt: { $gt: new Date() },
      }).populate({
        path: "screeningId",
        model: "screenings",
        select: "movieId startTime finalPrice",
      });

      if (!booking) {
        return response
          .status(404)
          .json({ message: "No active booking found or hold has expired" });
      }

      const bookingIdString = booking._id.toString();

      const payload = {
        return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/verify`,
        website_url: process.env.FRONT_PORT,
        amount: booking.totalPrice * 100,
        purchase_order_id: bookingIdString,
        purchase_order_name: `Movie Ticket Booking - ${holdId}`,
        customer_info: {
          name: request.body.name || "Customer",
          email: request.body.email || "customer@example.com",
          phone: request.body.mobile || "9800000000",
        },
      };

      const khaltiResponse = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        payload,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const pidxString = khaltiResponse.data.pidx;

      const paymentData = {
        userId,
        modeOfPayment: "KHALTI",
        screeningId: booking.screeningId,
        date: new Date(),
        time: new Date(),
        amount: booking.totalPrice,
      };

      if (booking._id) {
        paymentData.bookingId = booking._id;
      }

      if (pidxString) {
        paymentData.pidx = pidxString;
      }

      const payment = await Payment.create(paymentData);

      response.json({
        payment_url: khaltiResponse.data.payment_url,
        pidx: pidxString,
        bookingId: bookingIdString,
      });
    } catch (error) {
      response.status(500).json({
        message: "Payment initiation failed",
        error: error.response?.data || error.message,
      });
    }
  },

  verifyPayment: async (request, response) => {
    const { pidx } = request.body;

    const releaseLock = () => {
      if (paymentLocks.has(pidx)) {
        paymentLocks.delete(pidx);
      }
    };

    try {
      if (!pidx) {
        releaseLock();
        return response
          .status(400)
          .json({ message: "Missing payment identifier (PIDX)" });
      }

      if (paymentLocks.has(pidx)) {
        releaseLock();
        return response.status(400).json({
          message: "Verification already in progress",
          status: "in_progress",
        });
      }

      paymentLocks.set(pidx, true);

      const token = request.cookies.access_token;

      if (!token) {
        releaseLock();
        return response.status(401).json({ message: "Token not available" });
      }

      const userId = getUserIdFromToken(token);

      if (!isValidObjectId(userId)) {
        releaseLock();
        return response.status(401).json({ message: "Invalid user ID" });
      }

      const existingConfirmedBooking = await Booking.findOne({
        "paymentInfo.transactionId": pidx,
        status: "confirmed",
      });

      if (existingConfirmedBooking) {
        releaseLock();
        return response.json({
          message: "Payment already verified",
          confirmationCode:
            existingConfirmedBooking.confirmationDetails.confirmationCode,
          bookingId: existingConfirmedBooking._id,
          status: "already_confirmed",
        });
      }

      const paymentRecord = await Payment.findOne({ pidx, userId });

      const verificationResponse = await axios.post(
        "https://a.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentStatus = verificationResponse.data.status;

      if (paymentStatus !== "Completed") {
        releaseLock();
        return response.status(400).json({
          message: "Payment not completed",
          status: paymentStatus,
        });
      }

      let finalBookingId = null;

      if (verificationResponse.data.purchase_order_id) {
        finalBookingId = verificationResponse.data.purchase_order_id;
      } else if (paymentRecord && paymentRecord.bookingId) {
        finalBookingId = paymentRecord.bookingId.toString();
      }

      if (!finalBookingId) {
        releaseLock();
        return response
          .status(404)
          .json({ message: "Booking ID not found in payment response" });
      }

      const booking = await Booking.findOne({
        _id: finalBookingId,
        userId,
      });

      if (!booking) {
        releaseLock();
        return response.status(404).json({ message: "Booking not found" });
      }

      if (booking.status === "held") {
        booking.status = "confirmed";
        booking.holdExpiresAt = null;
        booking.paymentInfo = {
          transactionId: pidx,
          paymentMethod: "KHALTI",
          paidAmount: verificationResponse.data.total_amount / 100,
          paidAt: new Date(),
        };
        booking.confirmationDetails = {
          confirmedAt: new Date(),
          confirmationCode: Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase(),
        };

        await booking.save();
      }

      const paymentUpdate = await Payment.findOneAndUpdate(
        {
          userId,
          screeningId: booking.screeningId,
          modeOfPayment: "KHALTI",
          refundState: null,
        },
        { $set: { refundState: "SUCCESSFUL" } },
        { new: true }
      );

      const result = {
        message: "Payment verified and booking confirmed",
        confirmationCode: booking.confirmationDetails.confirmationCode,
        bookingId: booking._id,
        status: "success",
      };

      const updatedScreening = await Screening.findOneAndUpdate(
        {
          _id: booking.screeningId,
          // Verify seats are still held by this booking
          ...booking.seats.reduce((acc, { section, row, seatNumber }) => {
            acc[`seatGrid.${section}.rows.${row}.${seatNumber}.holdId`] =
              booking.holdId;
            return acc;
          }, {}),
        },
        {
          $set: {
            ...booking.seats.reduce((acc, { section, row, seatNumber }) => {
              acc[`seatGrid.${section}.rows.${row}.${seatNumber}`] = {
                code: "r",
                holdExpiresAt: null,
                holdId: null,
                bookingId: booking._id,
              };
              return acc;
            }, {}),
          },
          $inc: { version: 1 },
        },
        { new: true }
      );

      if (!updatedScreening) {
        console.log(
          "Failed to update screening seats, but payment was successful"
        );
      }

      releaseLock();
      response.json(result);
    } catch (error) {
      releaseLock();
      response.status(500).json({
        message: "Payment verification failed",
        error: error.response?.data || error.message,
        status: "error",
      });
    }
  },

  getPaymentStatus: async (request, response) => {
    try {
      const { pidx } = request.params;

      const verificationResponse = await axios.post(
        "https://a.khalti.com/api/v2/epayment/lookup/",
        { pidx },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      response.json(verificationResponse.data);
    } catch (error) {
      response.status(500).json({
        message: "Failed to check payment status",
        error: error.response?.data || error.message,
      });
    }
  },

  getAllPayments: async (request, response) => {
    try {
      const payments = await Payment.find();
      response.status(200).json(payments);
    } catch (error) {
      response.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default khaltiController;
