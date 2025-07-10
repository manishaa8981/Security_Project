export interface Payment {
  _id: string;
  userId: string;
  modeOfPayment: "KHALTI" | "DIRECT";
  screeningId: string;
  bookingId?: string;
  pidx?: string;
  date: string;
  time: string;
  amount: number;
  refundState: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface KhaltiPaymentRequest {
  holdId: string;
  returnUrl: string;
  name?: string;
  email?: string;
  mobile?: string;
}

export interface KhaltiPaymentResponse {
  payment_url: string;
  pidx: string;
}

export interface KhaltiVerifyRequest {
  pidx: string;
}
