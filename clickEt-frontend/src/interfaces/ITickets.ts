interface User {
  fullName: string;
}

interface Screening {
  date: string;
  movieName: string;
  posterUrl: string;
  theatreName: string;
  hallName: string;
}

interface Payment {
  method: string;
  paidAmount: number;
  paidAt: string;
}

interface Seat {
  seatId: string;
  section: number;
  row: number;
  seatNumber: number;
}

export interface Ticket {
  bookingId: string;
  confirmationCode: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  user: User;
  screening: Screening;
  payment: Payment;
  seats: Seat[];
}