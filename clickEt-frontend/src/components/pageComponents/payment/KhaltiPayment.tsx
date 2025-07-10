import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  useInitiateKhaltiPayment,
  useVerifyKhaltiPayment,
  useGetKhaltiPaymentStatus,
} from "@/api/paymentApi";
import { bookingService } from "@/service/bookingService";
import { useAuth } from "@/hooks/useAuth";

interface KhaltiPaymentProps {
  holdId: string;
  screeningId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const KhaltiPayment: React.FC<KhaltiPaymentProps> = ({
  holdId,
//   screeningId,
  amount,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState("9860452132");
  const [pidx, setPidx] = useState<string | null>(null);

  const initiatePaymentMutation = useInitiateKhaltiPayment();
  const verifyPaymentMutation = useVerifyKhaltiPayment();
  const { data: paymentStatus } = useGetKhaltiPaymentStatus(pidx);

  const verifyPayment = useCallback(
    async ({ pidx }: { pidx: string }) => {
      try {
        await verifyPaymentMutation.mutateAsync({ pidx });

        // Download ticket after successful payment
        const pdfUrl = await bookingService.downloadTicket();
        window.open(pdfUrl, "_blank");

        onSuccess();
        navigate("/bookings", { state: { confirmed: true } });
      } catch (error) {
        console.error("Payment verification failed:", error);
      }
    },
    [navigate, onSuccess, verifyPaymentMutation]
  );

  // Get pidx from URL query params if this is a return from Khalti
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pidxParam = params.get("pidx");
    const statusParam = params.get("status");

    if (pidxParam && statusParam === "Completed") {
      setPidx(pidxParam);
      verifyPayment({ pidx: pidxParam });
    }
  }, [location, verifyPayment]);

  // When payment status is completed, verify the payment
  useEffect(() => {
    if (paymentStatus?.status === "Completed" && pidx) {
      verifyPayment({ pidx });
    }
  }, [paymentStatus, verifyPayment, pidx]);

  const initiatePayment = async () => {
    if (!mobile) {
      toast.error("Phone number is required");
      return;
    }

    try {
      const returnUrl = `${window.location.origin}/payment/verify`;
      const result = await initiatePaymentMutation.mutateAsync({
        holdId,
        returnUrl,
        name,
        email,
        mobile,
      });

      setPidx(result.pidx);

      // Redirect to Khalti payment page
      window.location.href = result.payment_url;
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Payment Details</h2>
        <p className="text-gray-500">Amount: Rs. {amount.toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number*
          </label>
          <Input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Your Phone Number"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            * Required for Khalti payment
          </p>
        </div>
      </div>

      <div className="w-full flex justify-between gap-5">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          onClick={initiatePayment}
          disabled={initiatePaymentMutation.isPending || !mobile}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {initiatePaymentMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay with Khalti"
          )}
        </Button>
      </div>
    </div>
  );
};

export default KhaltiPayment;
