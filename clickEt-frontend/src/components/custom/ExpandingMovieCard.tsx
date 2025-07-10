import React, { useState, useCallback, useMemo } from "react";
import { ColorExtractor } from "react-color-extractor";
import { format } from "date-fns";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InteractiveHoverButton from "@/components/shadcn/interactive-hover-button";
import { Movie } from "@/interfaces/IMovie";

interface ExpandingCardProps {
  staticContentWidth?: string;
  expandedContentWidth?: string;
  totalContentWidth?: string;
  minMaxHeight?: string;
  movie: Movie;
}

const ExpandingCard: React.FC<ExpandingCardProps> = React.memo(
  ({
    staticContentWidth = "300px",
    expandedContentWidth = "300px",
    totalContentWidth = "600px",
    minMaxHeight = "500px",
    movie,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [dominantColor, setDominantColor] = useState("#ffffff");
    const navigate = useNavigate();

    const getLuminance = useCallback((hexColor: string) => {
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }, []);

    const getContrastColor = useCallback(
      (hexColor: string) => {
        const luminance = getLuminance(hexColor);
        return luminance > 0.5 ? "#000000" : "#ffffff";
      },
      [getLuminance]
    ); // Add getLuminance as dependency

    const styles = useMemo(
      () => ({
        container: {
          width: isHovered ? totalContentWidth : staticContentWidth,
          transition: "width 250ms ease-in-out",
          height: minMaxHeight,
          minWidth: "230px",
        },
        image: {
          width: staticContentWidth,
          minWidth: "230px",
        },
        content: {
          width: expandedContentWidth,
          transform: isHovered ? "translateX(0)" : "translateX(100%)",
          transition: "transform 250ms ease-in-out",
        },
        title: {
          color: dominantColor,
        },
        button: {
          backgroundColor: dominantColor,
          color: getContrastColor(dominantColor),
        },
      }),
      [
        isHovered,
        staticContentWidth,
        totalContentWidth,
        expandedContentWidth,
        dominantColor,
        minMaxHeight,
        getContrastColor,
      ]
    );

    const getColors = useCallback((colors: string[]) => {
      setDominantColor(colors[0] || "#ffffff");
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleButtonClick = useCallback(() => navigate("/"), [navigate]);

    const formattedDate = useMemo(
      () => format(new Date(movie.releaseDate), "MMM dd, yyyy"),
      [movie.releaseDate]
    );

    const MovieDetails = React.memo(() => (
      <div className="flex flex-col gap-2 w-full h-full overflow-hidden overflow-y-auto">
        <span
          className="text-[calc(0.8vw+0.5rem)] font-bold my-4"
          style={styles.title}
        >
          {movie.name}
        </span>
        <section className="text-secondary-foreground">
          <span>{movie.description}</span>
          <div className="mt-4 flex gap-3 items-center">
            <span className="font-semibold text-lg">Duration:</span>
            <span>{movie.duration_min} minutes</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-lg">Region:</span>
            <span>{movie.category}</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-lg">Language:</span>
            <span>{movie.language}</span>
          </div>
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-lg">Release Date:</span>
            <span>{formattedDate}</span>
          </div>
        </section>
        <div className="mt-7 w-full flex justify-center">
          <InteractiveHoverButton
            style={styles.button}
            className="w-64"
            icon={<Ticket />}
            onClick={handleButtonClick}
            text="Get Your ticket"
          />
        </div>
      </div>
    ));

    return (
      <div
        className="relative h-fit overflow-hidden rounded-lg cursor-pointer bg-gray-800"
        style={styles.container}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          data-testid="movie-card-img"
          className="flex-shrink-0 h-full bg-gray-500"
          style={styles.image}
        >
          <ColorExtractor getColors={getColors}>
            <img
              src={movie.posterURL.sm}
              alt={movie.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </ColorExtractor>
        </div>
        <div
          data-testid="movie-card-expanded-content"
          className="absolute right-0 top-0 h-full bg-secondary text-white p-4"
          style={styles.content}
        >
          <MovieDetails />
        </div>
      </div>
    );
  }
);

export default ExpandingCard;
