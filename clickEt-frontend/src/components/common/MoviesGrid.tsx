import React, { useState } from "react";
import { Movie } from "@/interfaces/IMovie";
import DominantColorExtractorCard from "../custom/ExpandingMovieCard";
import { Link } from "react-router-dom";

interface MoviesGridProps {
  movies: Movie[];

  rowGap?: number;
  colGap?: number;
}

const MoviesGrid: React.FC<MoviesGridProps> = ({
  rowGap = 30,
  colGap = 0,
  movies,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      data-testid="movies-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      style={{
        rowGap: `${rowGap}px`,
        columnGap: `${colGap}px`,
      }}
    >
      {movies.map((movie, index) => (
        <div
          data-testid="movie-card"
          className=""
          key={movie._id}
          style={{
            position: "relative",
            zIndex: hoveredIndex === index ? 10 : 1,
            transition: "z-index 0ms",
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Link to={`movie/${movie.slug}`} data-movie-slug={movie.slug}>
            <DominantColorExtractorCard
              movie={movie}
              staticContentWidth="18vw"
              expandedContentWidth="21vw"
              totalContentWidth="39vw"
              minMaxHeight="47vh"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MoviesGrid;
