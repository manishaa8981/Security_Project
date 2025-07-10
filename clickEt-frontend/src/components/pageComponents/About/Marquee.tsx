import { AnimatedTooltip } from "@/components/shadcn/animated-tooltip";

const Marquee = () => {
  const items = [
    {
      id: 1,
      name: "Esewa",
      designation: "Digital wallet company",
      image: "marquee_Images/esewa.png",
    },
    {
      id: 2,
      name: "Khalti",
      designation: "Digital wallet company",
      image: "marquee_Images/khalti.png",
    },
    {
      id: 3,
      name: "Big Movies",
      designation: "Movie Distributor company",
      image: "marquee_Images/big_movies.jpg",
    },
    {
      id: 4,
      name: "QFX Cinemas",
      designation: "Movie Distributor company",
      image: "marquee_Images/qfx.png",
    },
  ];

  return (
    <div className="flex justify-center p-3">
      <div className="flex flex-col items-center gap-10 w-fit h-fit py-10 px-[calc(1vw+0.3rem)]">
        <span className="text-primary text-center w-full text-[calc(1vw+2rem)] font-semibold">
          Trusted by
        </span>
        <div className="flex p-10 ">
          <AnimatedTooltip items={items} />
        </div>
      </div>
    </div>
  );
};

export default Marquee;
