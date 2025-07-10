import { useFetchAllBookings } from "@/api/bookingApi";
import { Card } from "@/components/shadcn/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/shadcn/table";
import { BookingResponse } from "@/interfaces/IBooking";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn/select";
import { Loader } from "lucide-react";
import { useState } from "react";

type FilterStatus = "all" | "confirmed" | "pending" | "cancelled";

const BookingsTable: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const { data: bookings = [], isLoading, error } = useFetchAllBookings();

  // Filter bookings based on the status field
  const filteredBookings = bookings.filter((booking: BookingResponse) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-primary">
          Error loading bookings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <Card className="space-y-4 p-4">
      {/* Header with filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as FilterStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Read-Only Table */}
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center font-bold">SN</TableHead>
            <TableHead className="font-bold">Confirmation Code</TableHead>
            <TableHead className="font-bold">User ID</TableHead>
            <TableHead className="font-bold">Screening ID</TableHead>
            <TableHead className="font-bold">Seats</TableHead>
            <TableHead className="font-bold">Total Price</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking: BookingResponse, index: number) => (
            <TableRow key={booking._id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                {booking.confirmationDetails.confirmationCode}
              </TableCell>
              <TableCell>{booking.userId}</TableCell>
              <TableCell>{booking.screeningId}</TableCell>
              <TableCell>
                {booking.seats.map((seat) => (
                  <span key={seat._id} className="block">
                    {`Sec ${seat.section}, Row ${seat.row}, Seat ${seat.seatNumber}`}
                  </span>
                ))}
              </TableCell>
              <TableCell>{booking.totalPrice}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>
                {new Date(booking.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BookingsTable;
