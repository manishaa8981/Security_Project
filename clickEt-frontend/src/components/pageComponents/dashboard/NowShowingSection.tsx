import { MovieSectionProps } from "@/interfaces/IMovie";
import { useFetchAllMoviesByStatus } from "@/api/movieApi";
import MoviesGrid from "@/components/common/MoviesGrid";

const MovieSection = ({ variant }: MovieSectionProps) => {
  // Use the custom hook to fetch movies
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useFetchAllMoviesByStatus(variant);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (movies.length === 0) {
    return (
      <section className="flex justify-start w-full pl-[10vw]">
        <div className="flex flex-col items-center py-10 gap-12">
          <span className="w-full text-4xl text-primary font-semibold border-l-[6px] pl-2 flex items-center border-primary">
            {variant === "showing" ? "Now Showing" : "Upcoming Movies"}
          </span>
          <div className="text-gray-500 text-lg">
            No {variant === "showing" ? "now showing" : "upcoming"} movies
            available.
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return <div>Error fetching movies. Please try again later.</div>;
  }

  return (
    <section
      data-testid={
        variant === "showing"
          ? "now-showing-section"
          : "upcoming-movies-section"
      }
      className="flex justify-start w-full pl-[10vw]"
    >
      <div className="flex flex-col py-10 gap-12 w-full">
        <span className="w-full text-4xl text-primary font-semibold border-l-[6px] pl-2 flex items-center border-primary">
          {variant === "showing" ? "Now Showing" : "Upcoming Movies"}
        </span>
        <div className="w-full overflow-x-auto">
          <MoviesGrid movies={movies} />
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
