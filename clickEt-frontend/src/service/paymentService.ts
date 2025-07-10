import { Payment } from "@/interfaces/IPayments";
import { axiosInstance } from "@/utils/axiosInstance";

export const paymentService = {
  initiateKhaltiPayment: async (data: {
    holdId: string;
    returnUrl: string;
    name?: string;
    email?: string;
    mobile?: string;
  }) => {
    const response = await axiosInstance.post(
      "/payments/khalti/initiate",
      data
    );
    return response.data;
  },

  verifyKhaltiPayment: async (data: { pidx: string }) => {
    const response = await axiosInstance.post("/payments/khalti/verify", data);
    return response.data;
  },

  getKhaltiPaymentStatus: async (pidx: string) => {
    const response = await axiosInstance.get(`/payments/khalti/status/${pidx}`);
    return response.data;
  },

  fetchAllPayments: async (): Promise<Payment[]> => {
    const response = await axiosInstance.get(`/payments/getAll`);
    return response.data;
  },
};
