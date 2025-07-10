// src/service/movieService.ts
import { axiosInstance } from "@/utils/axiosInstance";
import { MovieFormValues } from "@/lib/formSchemas/movieFormSchema";
import { format } from "date-fns";
import { decodeHTMLEntities } from "@/utils/htmlDecoder";
import { Movie } from "@/interfaces/IMovie";

export const fetchAllMoviesbyStatus = async (
  variant: string
): Promise<Movie[]> => {
  const url = `/movie/status/${variant}`;
  const response = await axiosInstance.get(url);

  if (!response.data?.movies) {
    return [];
  }

  const decodedMovies = response.data.movies.map((movie: Movie) => ({
    ...movie,
    posterURL: {
      sm: decodeHTMLEntities(movie.posterURL.sm),
      lg: decodeHTMLEntities(movie.posterURL.lg),
    },
    trailerURL: decodeHTMLEntities(movie.trailerURL),
  }));

  return decodedMovies;
};
export const fetchAllMovies = async (): Promise<Movie[]> => {
  const url = "/movie/getAll";
  const response = await axiosInstance.get(url);

  if (!response.data?.movies) {
    return [];
  }

  // Decode HTML entities in the URLs
  const decodedMovies = response.data.movies.map((movie: Movie) => ({
    ...movie,
    posterURL: {
      sm: decodeHTMLEntities(movie.posterURL.sm),
      lg: decodeHTMLEntities(movie.posterURL.lg),
    },
    trailerURL: decodeHTMLEntities(movie.trailerURL),
  }));

  return decodedMovies;
};

export async function addMovie(credentials: MovieFormValues) {
  const payload = {
    ...credentials,
    releaseDate: format(credentials.releaseDate, "yyyy-MM-dd"),
  };
  const { data } = await axiosInstance.post("/movie/add", payload);
  return data;
}

export async function fetchMovieBySlug(slug: string) {
  try {
    const response = await axiosInstance.get(`/movie/${slug}`);

    if (!response.data?.movie) {
      throw new Error("No movie found");
    }

    const movie = response.data.movie;

    // Decode HTML entities in URLs
    return movie;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export const toggleMovieStatus = async (movie_id: string): Promise<Movie> => {
  const response = await axiosInstance.patch(`/movie/toggle/${movie_id}`);
  return response.data;
};

export const deleteMovie = async (id: string) => {
  const response = await axiosInstance.delete(`/movie/delete/${id}`);
  return response.data;
};
