// api/screeningApi.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createScreening,
  deleteScreening,
  fetchAllScreenings,
  fetchScreeningsByMovie, 
} from "@/service/screeningService";
import { toast } from "sonner";


export const useCreateScreening = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createScreening,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
      toast.success("Screening created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create screening"
      );
    },
  });
};

// New hook to fetch screenings by movie ID
export const useFetchScreeningsByMovie = (movieId: string) => {
  return useQuery({
    queryKey: ["screenings", "byMovie", movieId],
    queryFn: () => fetchScreeningsByMovie(movieId),
    // Don't run the query if movieId is empty
    enabled: !!movieId,
  });
};


export const useFetchAllScreenings = () => {
  return useQuery({
    queryKey: ["screenings"],
    queryFn: fetchAllScreenings,
  });
};

export const useDeleteScreening = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteScreening(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
      toast.success("Screening deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete screening"
      );
    },
  });
};


