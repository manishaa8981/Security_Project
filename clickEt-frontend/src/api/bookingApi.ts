import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "@/service/bookingService";
import { BookingResponse } from "@/interfaces/IBooking";
import { Ticket } from "@/interfaces/ITickets";

export interface Seat {
  section: number;
  row: number;
  seatNumber: number;
}

interface BookingHoldRequest {
  screeningId: string;
  seats: Seat[];
}

interface BookingHoldResponse {
  holdId: string;
  expiresAt: string;
  message: string;
}

interface BookingConfirmRequest {
  screeningId: string;
  holdId: string;
  paymentInfo: any;
}

export const useGetScreeningDetails = (screeningId: string) => {
  return useQuery({
    queryKey: ["screening", screeningId],
    queryFn: () => bookingService.getScreeningDetails(screeningId),
    refetchInterval: 5000, // Poll every 5 seconds
  });
};

export const useHoldSeats = () => {
  return useMutation<BookingHoldResponse, Error, BookingHoldRequest>({
    mutationFn: (data) => bookingService.holdSeats(data),
    onError: (error) => {
      toast.error(error.message || "Failed to hold seats");
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, BookingConfirmRequest>({
    mutationFn: (data) => bookingService.confirmBooking(data),
    onSuccess: () => {
      toast.success("Booking confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["screening"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm booking");
    },
  });
};

export const useReleaseHold = () => {
  return useMutation<any, Error, string>({
    mutationFn: (holdId) => bookingService.releaseHold(holdId),
    onSuccess: () => {
      toast.success("Hold released successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to release hold");
    },
  });
};


export const useFetchAllBookings = () => {
  return useQuery<BookingResponse[], Error>({
    queryKey: ["bookings"], // Unique key for the query
    queryFn: () => bookingService.fetchAllBookings(), // Use the service function
  });
};
export const useFetchBookingHistory = () => {
  return useQuery<Ticket[], Error>({
    queryKey: ["bookings"], 
    queryFn: () => bookingService.fetchUserBookingHistory(), 
  });
};