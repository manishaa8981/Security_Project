import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { useVerifyKhaltiPayment } from "@/api/paymentApi";
import { bookingService } from "@/service/bookingService";
import { Card } from "@/components/shadcn/card";

const PaymentVerifyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  const verifyPaymentMutation = useVerifyKhaltiPayment();

  useEffect(() => {
    if (verificationAttempted) {
      return;
    }

    const verifyPayment = async () => {
      try {
        setVerificationAttempted(true);
        const params = new URLSearchParams(location.search);
        const pidx = params.get("pidx");
        const status = params.get("status");

        if (!pidx) {
          setError("Missing payment information");
          setVerifying(false);
          return;
        }

        if (status !== "Completed") {
          setError(`Payment ${status || "failed"}`);
          setVerifying(false);
          return;
        }

        const response = await verifyPaymentMutation.mutateAsync({ pidx });

        // Check if payment was already verified
        if (response?.status === "already_confirmed") {
          toast.info("Payment was already confirmed");
        }

        setSuccess(true);
        setVerifying(false);

        // Download ticket after successful payment
        try {
          const pdfUrl = await bookingService.downloadTicket();
          window.open(pdfUrl, "_blank");
        } catch (error) {
          toast.error("Ticket download failed, please check your bookings");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setError(err?.message || "Payment verification failed");
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location, verifyPaymentMutation, verificationAttempted]);

  // If verification is still pending after 30 seconds, show an error
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (verifying) {
        setVerifying(false);
        setError(
          "Verification timed out. Please check your bookings to confirm payment status."
        );
      }
    }, 30000);

    return () => clearTimeout(timeoutId);
  }, [verifying]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[97vh] p-4">
      <Card className="p-8 max-w-md w-full text-center">
        {verifying ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <h2 className="text-2xl font-bold">Verifying Payment</h2>
            <p className="text-gray-500">
              Please wait while we verify your payment...
            </p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Payment Successful!</h2>
            <p className="text-stone-500">
              Your booking has been confirmed. You can view your tickets in your
              booking history.
            </p>
            <Button onClick={() => navigate("/bookings")} className="mt-4">
              View My Bookings
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold">Payment Failed</h2>
            <p className="text-gray-600">
              {error || "There was an error processing your payment."}
            </p>
            <div className="flex flex-col space-y-2 mt-4">
              <Button onClick={() => navigate("/bookings")}>
                Check My Bookings
              </Button>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Home
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentVerifyPage;
