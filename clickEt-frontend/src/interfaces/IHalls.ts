export interface SeatSection {
  rows: number;
  columns: number;
  startRow: string;
  startNumber: number;
}

export interface Layout {
  sections: SeatSection[];
}

export interface Hall {
  _id: string;
  theatreId: string;
  location: string;
  name: string;
  layout: Layout;
  totalSeats: number;
  isActive: boolean;
}

export interface CreateHallRequest {
  theatreId: string;
  location: string;
  name: string;
  layout: Layout;
  totalSeats: number;
}

export interface CreateHallResponse {
  message: string;
  hall: Hall;
}

export interface SectionState extends SeatSection {
  id: number;
  selectedSeats: Set<string>;
}

type Seat = {
  code: "a" | "h" | "r";
  holdExpiresAt: string | null;
  holdId: string | null;
  bookingId: string | null;
};

type Section = {
  section: number;
  rows: Seat[][];
};

export type ShowData = {
  seatGrid: Section[];
  finalPrice: number;
};
