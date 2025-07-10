import { KhaltiPaymentRequest, KhaltiPaymentResponse, KhaltiVerifyRequest, Payment } from "@/interfaces/IPayments";
import { paymentService } from "@/service/paymentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInitiateKhaltiPayment = () => {
    return useMutation<KhaltiPaymentResponse, Error, KhaltiPaymentRequest>({
      mutationFn: (data) => paymentService.initiateKhaltiPayment(data),
      onError: (error) => {
        toast.error(error.message || "Failed to initiate payment");
      },
    });
  };
  
  export const useVerifyKhaltiPayment = () => {
    const queryClient = useQueryClient();
  
    return useMutation<any, Error, KhaltiVerifyRequest>({
      mutationFn: (data) => paymentService.verifyKhaltiPayment(data),
      onSuccess: () => {
        toast.success("Payment verified successfully");
        queryClient.invalidateQueries({ queryKey: ["screening"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to verify payment");
      },
    });
  };
  
  export const useGetKhaltiPaymentStatus = (pidx: string | null) => {
    return useQuery({
      queryKey: ["khalti-payment", pidx],
      queryFn: () => paymentService.getKhaltiPaymentStatus(pidx as string),
      enabled: !!pidx, // Only run if pidx is available
      refetchInterval: 3000, // Poll every 3 seconds while checking payment status
    });
  };
  export const useFetchAllPayments = () => {
    return useQuery<Payment[], Error>({
      queryKey: ["bookings"], // Unique key for the query
      queryFn: () => paymentService.fetchAllPayments(), // Use the service function
    });
  };