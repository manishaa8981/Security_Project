import { Ticket } from "@/interfaces/ITickets";
import { formatTime,formatDate } from "@/utils/dateTimeUtils";
import { useState } from "react";
import BookingDetailsDialog from "./BookingDetailsDialog";

const TicketItem = ({ booking }: { booking: Ticket }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
      <>
        <div className="mb-6 relative">
          <div className="relative">
            {/* Main ticket body */}
            <div className="bg-amber-50 dark:bg-amber-100 rounded-lg overflow-hidden flex relative">
              {/* Left border notches */}
              <div className="absolute top-0 left-0 size-5 bg-card rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-r border-b border-primary"></div>
              <div className="absolute bottom-0 left-0 size-5 bg-card rounded-full transform -translate-x-1/2 translate-y-1/2 border-4 border-r border-t border-primary"></div>
              
              {/* Right border notches */}
              <div className="absolute top-0 right-0 size-5 bg-card rounded-full transform translate-x-1/2 -translate-y-1/2 border-4 border-l border-b border-primary"></div>
              <div className="absolute bottom-0 right-0 size-5 bg-card rounded-full transform translate-x-1/2 translate-y-1/2 border-4 border-l border-t border-primary"></div>
              
              {/* Left side grooves */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 -ml-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`left-${i}`} className="w-4 h-1.5 bg-card  border-[2px] border-primary rounded-full"></div>
                ))}
              </div>
              
              {/* Right side grooves */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 -mr-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`right-${i}`} className="w-4 h-1.5 bg-card  border-[2px] border-primary rounded-full"></div>
                ))}
              </div>
              
              {/* Ticket content */}
              <div className="flex w-full border-2 border-primary pl-6">
                {/* Left side - Movie poster */}
                <div className="w-24 h-32 flex-shrink-0 p-2">
                  <img
                    src={booking.screening.posterUrl}
                    alt={booking.screening.movieName}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                
                {/* Middle - Movie details */}
                <div className="flex-grow p-3 text-black">
                  <h3 className="font-bold text-lg truncate">
                    {booking.screening.movieName}
                  </h3>
                  <p className="text-sm">
                    {formatDate(booking.screening.date).split(',')[0]}, {formatDate(booking.screening.date).split(',')[1]}
                  </p>
                  <p className="text-sm">{formatTime(booking.screening.date)}</p>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-sm text-primary hover:underline mt-1"
                  >
                    View details
                  </button>
                </div>
                
                <div className="pr-2 w-20 border-l border-primary flex items-center justify-center relative">
                  <div className="transform rotate-90 origin-center font-mono text-xl text-primary">
                    {booking.confirmationCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <BookingDetailsDialog
          booking={booking}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </>
    );
  };

  export default TicketItem;