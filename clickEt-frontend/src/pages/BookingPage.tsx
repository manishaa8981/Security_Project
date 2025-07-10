import { useFetchBookingHistory } from "@/api/bookingApi";
import TicketItem from "@/components/pageComponents/booking/Ticket";
import { Card } from "@/components/shadcn/card";

const BookingsList = () => {
  const { data: bookings = [], isLoading, error } = useFetchBookingHistory();

  if (isLoading) {
    return <div className="p-4 text-center">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-primary">
        Error loading bookings: {error.message}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4 text-center">You don't have any bookings yet.</div>
    );
  }

  return (
    <div className="w-[90vw] mx-auto p-4 mt-24 min-h-[90vh]">
      <h2 className="text-4xl font-bold mb-6 text-primary">My Bookings</h2>
      <Card className="p-12">
        <div>
          {bookings.map((booking) => (
            <TicketItem key={booking.bookingId} booking={booking} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BookingsList;