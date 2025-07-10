// src/components/SeatLayout.tsx
import { useState } from "react";
import { Armchair, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";

import { useSeatLayout } from "@/api/hallApi";
import {
  useHoldSeats,
  useConfirmBooking,
  useReleaseHold,
} from "@/api/bookingApi";
import { bookingService } from "@/service/bookingService";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import AlertDialog from "@/components/common/AlertDialog";
import KhaltiPayment from "@/components/pageComponents/payment/KhaltiPayment";

type SeatIconProps = {
  status: "available" | "held" | "booked" | "selected";
  selected: boolean;
  seatId: string;
  onClick: () => void;
  disabled?: boolean;
};

const SeatIcon: React.FC<SeatIconProps> = ({
  status = "available",
  selected = false,
  seatId,
  onClick,
  disabled = false,
}) => {
  const baseClasses = "flex flex-col items-center gap-1 transition-transform";
  const iconClasses = {
    available: selected
      ? "text-green-600 cursor-pointer"
      : "text-gray-400 hover:text-green-500 cursor-pointer",
    held: "text-yellow-500",
    booked: "text-primary",
    selected: "text-green-600 cursor-pointer",
  };

  return (
    <div
      className={`${baseClasses} ${disabled ? "cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <Armchair
        className={`w-6 h-6 transition-colors ${iconClasses[status]}`}
      />
      {selected && <span className="text-xs font-medium">{seatId}</span>}
    </div>
  );
};

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

type SeatLayoutProps = {
  screeningId: string;
};

export const SeatLayout: React.FC<SeatLayoutProps> = ({ screeningId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [holdId, setHoldId] = useState<string | null>(null);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState<"select" | "hold" | "payment">(
    "select"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "direct" | "khalti" | null
  >(null);

  const { data: showData, error, isLoading } = useSeatLayout(screeningId);

  const holdSeatsMutation = useHoldSeats();
  const confirmBookingMutation = useConfirmBooking();
  const releaseHoldMutation = useReleaseHold();

  const maxRowCount =
    showData?.seatGrid.reduce(
      (max, section) => Math.max(max, section.rows.length),
      0
    ) || 0;

  const rowChar = (index: number) => String.fromCharCode(65 + index);

  const getSectionStartNumber = (sectionIndex: number): number => {
    if (!showData || sectionIndex === 0) return 1;

    return showData.seatGrid
      .slice(0, sectionIndex)
      .reduce((sum, section) => sum + section.rows[0].length, 1);
  };

  const getSeatNumber = (sectionIndex: number, seatIndex: number): number => {
    const sectionStartNumber = getSectionStartNumber(sectionIndex);
    return sectionStartNumber + seatIndex;
  };

  const parseSeatId = (seatId: string) => {
    const match = seatId.match(/([A-Z])(\d+)/);
    if (!match) throw new Error("Invalid seat ID format");

    const rowChar = match[1];
    const seatNumber = parseInt(match[2]);

    let section = 0;
    let cumulativeSeats = 0;
    let seatIndex = 0;

    for (let i = 0; i < showData!.seatGrid.length; i++) {
      const sectionColumnCount = showData!.seatGrid[i].rows[0].length;
      const nextCumulativeSeats = cumulativeSeats + sectionColumnCount;

      if (seatNumber > cumulativeSeats && seatNumber <= nextCumulativeSeats) {
        section = i;
        seatIndex = seatNumber - cumulativeSeats - 1;
        break;
      }

      cumulativeSeats = nextCumulativeSeats;
    }

    return {
      section,
      row: rowChar.charCodeAt(0) - 65,
      seatIndex,
    };
  };

  const toggleSeatSelection = (
    seatId: string,
    isBooked: boolean,
    isHeld: boolean
  ) => {
    if (isBooked || isHeld || bookingStep !== "select") return;

    setSelectedSeats((prev) => {
      const newSet = new Set(prev);

      if (!newSet.has(seatId) && newSet.size >= 10) {
        toast.error("You can only select up to 10 seats.");
        return prev;
      }

      if (newSet.has(seatId)) {
        newSet.delete(seatId);
      } else {
        newSet.add(seatId);
      }

      return newSet;
    });
  };

  const holdSelectedSeats = async () => {
    if (selectedSeats.size === 0) {
      toast.error("Please select seats first");
      return;
    }

    if (!user) setAuthDialogOpen(true);

    try {
      const seats = Array.from(selectedSeats).map((seatId) => {
        const parsedSeat = parseSeatId(seatId);
        return {
          section: parsedSeat.section,
          row: parsedSeat.row,
          seatNumber: parsedSeat.seatIndex,
          seatId: seatId,
        };
      });

      const result = await holdSeatsMutation.mutateAsync({
        screeningId,
        seats,
      });

      setHoldId(result.holdId);
      setBookingStep("hold");

      const expiryTime = new Date(result.expiresAt).getTime();
      startHoldTimer(expiryTime);

      toast.success("Seats held successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to hold seats");
    }
  };

  const confirmBooking = async () => {
    if (!holdId) {
      toast.error("No seats are currently held");
      return;
    }

    // For direct confirmation (without Khalti)
    if (paymentMethod === "direct") {
      try {
        await confirmBookingMutation.mutateAsync({
          screeningId,
          holdId,
          paymentInfo: {
            // Add payment info here
          },
        });

        setBookingStep("select");
        clearHoldTimer();
        toast.success("Booking confirmed successfully");
        const pdfUrl = await bookingService.downloadTicket();
        window.open(pdfUrl, "_blank");
      } catch (err: any) {
        toast.error(err?.message || "Failed to confirm booking");
      }
    } else {
      // Set payment method to Khalti if not already set
      setPaymentMethod("khalti");
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentMethod(null);
    setBookingStep("select");
    clearHoldTimer();
    setSelectedSeats(new Set());
  };

  const handlePaymentCancel = () => {
    setPaymentMethod(null);
  };

  const releaseHeldSeats = async () => {
    if (!holdId) {
      toast.error("No seats are currently held");
      return;
    }

    try {
      await releaseHoldMutation.mutateAsync(holdId);
      setHoldId(null);
      setBookingStep("select");
      clearHoldTimer();
      setSelectedSeats(new Set());
    } catch (err: any) {
      toast.error(err?.message || "Failed to release hold");
    }
  };

  const startHoldTimer = (expiryTime: number) => {
    const timer = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));

      setHoldTimer(timeLeft);

      if (timeLeft === 0) {
        clearInterval(timer);
        setHoldId(null);
        setBookingStep("select");
        toast.error("Seat hold expired");
      }
    }, 1000);
  };

  const clearHoldTimer = () => {
    setHoldTimer(null);
    setHoldId(null);
  };

  const renderRows = () => {
    if (!showData) return null;

    const rows: JSX.Element[] = [];
    for (let rowIndex = 0; rowIndex < maxRowCount; rowIndex++) {
      const label = rowChar(rowIndex);

      rows.push(
        <div
          key={rowIndex}
          className={
            "flex items-center mb-2.5 transform transition-transform duration-300 " +
            (Array.from(selectedSeats).some((id) => id.startsWith(label))
              ? "-translate-y-2"
              : "")
          }
        >
          <div className="w-8 flex items-center justify-center font-medium">
            {label}
          </div>

          <div className="flex gap-8">
            {showData.seatGrid.map((section: Section, sectionIndex: number) => {
              if (rowIndex >= section.rows.length) {
                return (
                  <div
                    key={`empty-${sectionIndex}`}
                    style={{ minWidth: "100px" }}
                  />
                );
              }

              const rowSeats = section.rows[rowIndex];
              return (
                <div key={`section-${sectionIndex}`} className="flex gap-2">
                  {rowSeats.map((seat: Seat, seatIndex: number) => {
                    const seatNumber = getSeatNumber(sectionIndex, seatIndex);
                    const seatId = `${label}${seatNumber}`;
                    const isSelected = selectedSeats.has(seatId);

                    let status: SeatIconProps["status"] = "available";
                    if (seat.code === "r") status = "booked";
                    else if (seat.code === "h") status = "held";
                    else if (isSelected) status = "selected";

                    return (
                      <SeatIcon
                        key={`seat-${seatId}`}
                        status={status}
                        selected={isSelected}
                        seatId={seatId}
                        onClick={() =>
                          toggleSeatSelection(
                            seatId,
                            seat.code === "r",
                            seat.code === "h"
                          )
                        }
                        disabled={bookingStep !== "select" || seat.code !== "a"}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return rows;
  };

  if (isLoading && !showData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-primary text-center p-4">{`${error}`}</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4  mt-5 flex flex-col items-center bg-secondary">
      <span className="text-2xl font-semibold text-primary my-5 ">
        Please select your seats
      </span>
      {/* Screen */}
      <div className="w-full max-w-3xl mx-auto mb-8">
        <div className="h-8 bg-primary rounded-sm flex items-center justify-center text-white">
          Screen
        </div>
      </div>

      <div className="flex flex-col items-center">{renderRows()}</div>

      {/* Bottom numbers */}
      <div className="flex justify-center items-center mt-5">
        <div className="w-8" />
        <div className="flex gap-8">
          {showData?.seatGrid.map((section: Section, sectionIndex: number) => {
            const columns = section.rows[0]?.length || 0;
            return (
              <div key={`numbers-${sectionIndex}`} className="flex gap-2">
                {Array.from({ length: columns }, (_, seatIndex: number) => {
                  const seatNumber = getSeatNumber(sectionIndex, seatIndex);
                  return (
                    <div
                      key={`number-${seatNumber}`}
                      className="w-[25px] text-center text-sm font-medium"
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <SeatIcon
            status="available"
            selected={false}
            seatId=""
            onClick={() => {}}
          />
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <SeatIcon
            status="held"
            selected={false}
            seatId=""
            onClick={() => {}}
          />
          <span className="text-sm">Held</span>
        </div>
        <div className="flex items-center gap-2">
          <SeatIcon
            status="booked"
            selected={false}
            seatId=""
            onClick={() => {}}
          />
          <span className="text-sm">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <SeatIcon
            status="selected"
            selected={true}
            seatId=""
            onClick={() => {}}
          />
          <span className="text-sm">Selected</span>
        </div>
      </div>

      {/* Selected seats and actions */}
      <div className="mt-6 space-y-4">
        {selectedSeats.size > 0 && (
          <div className="text-center">
            <p className="font-medium">
              Selected Seats: {Array.from(selectedSeats).join(", ")}
            </p>
          </div>
        )}

        {holdTimer !== null && (
          <div className="text-center text-sm">
            Time remaining: {Math.floor(holdTimer / 60)}:
            {(holdTimer % 60).toString().padStart(2, "0")}
          </div>
        )}

        <div className="flex justify-center gap-4">
          {bookingStep === "select" && selectedSeats.size > 0 && (
            <Button
              onClick={holdSelectedSeats}
              disabled={holdSeatsMutation.isPending}
            >
              {holdSeatsMutation.isPending
                ? "Holding..."
                : "Hold Selected Seats"}
            </Button>
          )}

          {bookingStep === "hold" && (
            <>
              {paymentMethod === "khalti" ? (
                <KhaltiPayment
                  holdId={holdId as string}
                  screeningId={screeningId}
                  amount={showData?.finalPrice * selectedSeats.size}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">
                      Choose payment method
                    </h3>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setPaymentMethod("direct")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Direct Confirmation
                    </Button>
                    <Button
                      onClick={() => setPaymentMethod("khalti")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Pay with Khalti
                    </Button>
                    <Button
                      onClick={releaseHeldSeats}
                      disabled={releaseHoldMutation.isPending}
                      variant="outline"
                    >
                      {releaseHoldMutation.isPending
                        ? "Releasing..."
                        : "Release Hold"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {bookingStep === "hold" && paymentMethod === "direct" && (
            <Button
              onClick={confirmBooking}
              disabled={confirmBookingMutation.isPending}
            >
              {confirmBookingMutation.isPending
                ? "Confirming..."
                : "Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
      <AlertDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onConfirm={() => {
          navigate("/login");
        }}
        description="In order to book a seat, you must login first."
        isProcessing={false}
        actionText="Proceed to Login"
        processingText="Login"
      />
    </div>
  );
};

export default SeatLayout;
