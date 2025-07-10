import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTheatre, deleteTheatre, fetchAllTheatres } from "@/service/theatreService";
import { Theatre } from "@/interfaces/ITheatre";
import { FinalTheatreData } from "@/components/pageComponents/theatre/theatreForm/TheatreForm";

export const useAddTheatre = () => {
  return useMutation({
    mutationFn: (theatreDetails: FinalTheatreData) =>
      addTheatre(theatreDetails),
    onSuccess: () => {
      toast.success("Theatre Added Successfully", {
        className: "text-white border-success",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Adding Theatre failed", {
        className: "bg-error text-white border-error",
      });
    },
  });
};

export const useFetchAllTheatres = () => {
  return useQuery<Theatre[], Error>({
    queryKey: ["theatres"], 
    queryFn: () => fetchAllTheatres(),
  });
};

export const useDeleteTheatre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteTheatre(id),
    onSuccess: () => {
      toast.success("Distributor deleted successfully", {
        className: "text-white border-success",
      });
      // Invalidate and refetch the distributors list
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete distributor", {
        className: "bg-error text-white border-error",
      });
    },
  });
};
