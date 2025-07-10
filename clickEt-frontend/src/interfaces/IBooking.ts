export type Seat = {
    section: number;
    row: number;
    seatNumber: number;
    seatId:string;
    _id: string;
  };
  
  export interface BookingResponse {
    _id: string;
    userId: string;
    screeningId: string;
    seats: Seat[];
    totalPrice: number;
    status: string;
    holdExpiresAt: string | null;
    holdId: string;
    createdAt: string;
    updatedAt: string;
    confirmationDetails: {
      confirmedAt: string;
      confirmationCode: string;
    };
    __v: number;
  }