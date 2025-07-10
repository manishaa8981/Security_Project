import { Ticket } from "@/interfaces/ITickets";
import { formatTime, formatDate } from "@/utils/dateTimeUtils";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter  } from "@/components/shadcn/dialog";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Button } from "@/components/shadcn/button";

const BookingDetailsDialog = ({
  booking,
  isOpen,
  onClose,
}: {
  booking: Ticket;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">
            {booking.screening.movieName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            <div>
              <h3 className="text-lg font-semibold">Booking Details</h3>
              <p>
                Status: <span className="capitalize">{booking.status}</span>
              </p>
              <p>
                Confirmation Code:{" "}
                <span className="font-mono font-bold">
                  {booking.confirmationCode}
                </span>
              </p>
              <p>
                Booked on: {formatDate(booking.createdAt)} at{" "}
                {formatTime(booking.createdAt)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Screening Details</h3>
              <p>Theater: {booking.screening.theatreName}</p>
              <p>Hall: {booking.screening.hallName}</p>
              <p>Date: {formatDate(booking.screening.date)}</p>
              <p>Time: {formatTime(booking.screening.date)}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Seats</h3>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <span
                    key={seat.seatId}
                    className="px-2 py-1 bg-primary rounded-md"
                  >
                    {seat.seatId}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Payment</h3>
              <p>Method: {booking.payment.method}</p>
              <p>Amount: Rs. {booking.payment.paidAmount.toLocaleString()}</p>
              <p>
                Paid on: {formatDate(booking.payment.paidAt)} at{" "}
                {formatTime(booking.payment.paidAt)}
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            onClick={() => {
              onClose();
            }}
            className="w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
