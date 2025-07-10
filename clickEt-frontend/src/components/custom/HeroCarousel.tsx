import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFetchAllMovies } from "@/api/movieApi";
import { Movie } from "@/interfaces/IMovie";

const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds
const USER_INACTIVITY_TIMEOUT = 10000; // 10 seconds

export default function HeroCarousel() {
  const { data: movies, isError } = useFetchAllMovies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  const images = movies?.map((movie: Movie) => movie.posterURL.lg) || [];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  const handleUserInteraction = useCallback(() => {
    setIsAutoScrolling(false);
    setLastInteractionTime(Date.now());
  }, []);

  useEffect(() => {
    let autoScrollTimer: NodeJS.Timeout;
    let userInactivityTimer: NodeJS.Timeout;

    if (isAutoScrolling && images.length > 0) {
      autoScrollTimer = setInterval(nextSlide, AUTO_SCROLL_INTERVAL);
    } else {
      userInactivityTimer = setTimeout(() => {
        if (Date.now() - lastInteractionTime >= USER_INACTIVITY_TIMEOUT) {
          setIsAutoScrolling(true);
        }
      }, USER_INACTIVITY_TIMEOUT);
    }

    return () => {
      clearInterval(autoScrollTimer);
      clearTimeout(userInactivityTimer);
    };
  }, [isAutoScrolling, lastInteractionTime, nextSlide, images.length]);

  if (isError || images.length === 0) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-red-500">
        Failed to load movies.
      </div>
    );
  }

  return (
    <div
      data-testid="hero-carousel"
      className="relative w-full max-md:h-[80vw] h-[80vh] overflow-hidden"
    >
      <div className="w-full h-full overflow-hidden">
        {images.map((src, index) => (
          <div
            key={src}
            data-testid={`hero-slide-${index}`}
            data-visible={index === currentIndex}
            className={`absolute top-0 w-full h-full transition-transform duration-1000 ease-in-out ${
              index === currentIndex
                ? "left-0"
                : index < currentIndex
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <Link to={`/movie/${movies?.[index].slug}`}>
              <img
                src={src}
                alt={movies?.[index].name}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-md hover:bg-primary transition-all duration-300"
        onClick={() => {
          handleUserInteraction();
          prevSlide();
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-md hover:bg-primary transition-all duration-300"
        onClick={() => {
          handleUserInteraction();
          nextSlide();
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
