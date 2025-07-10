import Marquee from "@/components/pageComponents/About/Marquee";
import { Card, CardContent } from "@/components/shadcn/card";
import { Clock, Calendar, CreditCard, Popcorn } from "lucide-react";

const MovieBookingPlatform = () => {
  const features = [
    {
      title: "Real-time Seat Updates",
      description: "See available seats instantly as others book",
      icon: <Clock className="h-10 w-10 text-primary" />,
    },
    {
      title: "Up-to-date Movie Screenings",
      description: "Latest showtimes and new releases at your fingertips",
      icon: <Calendar className="h-10 w-10 text-primary" />,
    },
    {
      title: "Easy Payment",
      description: "Secure and hassle-free payment options",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
    },
    {
      title: "Seamless Experience",
      description: "From booking to watching, we make it simple",
      icon: <Popcorn className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen">
        <div className="flex items-center justify-center p-8 ">
          <img src="src/assets/icons/logo/Logo.png" alt="ClickEt Logo" />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-[2rem] font-bold ">
            <span className="text-[3rem] text-primary">Clicket</span> -
            Ticket-booking platform for movie fans
          </h1>
          <p className="text-lg mt-7 text-justify">
            Experience the ultimate convenience in movie ticket booking. Clicket
            connects movie enthusiasts with their favorite theaters, offering a
            streamlined booking process that puts you in control.
          </p>
          <p className="text-lg mt-4 text-justify">
            Skip the lines and secure the best seats for blockbusters, indie
            gems, and everything in between. With Clicket, your perfect movie
            night is just a few taps away.
          </p>
        </div>
      </div>

      <h2 className="text-5xl font-semibold text-center mb-11 text-primary">
        We Offer
      </h2>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-2 hover:border-primary transition-all duration-300"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group border-2 transition-all duration-300 transform hover:scale-105 hover:border-red-500"
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              {/* Icon changes to red on hover */}
              <div className="mb-4 text-gray-600 group-hover:text-red-500 transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Heading changes to red on hover */}
              <h3 className="text-xl font-bold mb-6 text-foreground group-hover:text-red-500 transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Use a different color for the description */}
              <p className="text-gray-500">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Marquee />
    </div>
  );
};

export default MovieBookingPlatform;
