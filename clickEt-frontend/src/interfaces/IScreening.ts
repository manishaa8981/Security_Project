import { Seat } from "@/api/bookingApi";

export interface CreateScreeningPayload {
  movieId: string;
  distributorId: string;
  theatreId: string;
  hallId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
}

export interface Screening {
    _id: string;
    movieId: string;
    distributorId: string;
    theatreId: string;
    hallId: string;
    startTime: Date;
    endTime: Date;
    basePrice: number;
    finalPrice: number;
    seatGrid: Seat[][];
    status: 'scheduled' | 'cancelled' | 'completed';
  }
  