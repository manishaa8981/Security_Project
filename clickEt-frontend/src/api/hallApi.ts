import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hallService } from "@/service/hallService";
import {
  CreateHallRequest,
  CreateHallResponse,
  Hall,
  ShowData,
} from "@/interfaces/IHalls";

export const useCreateHall = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateHallResponse, Error, CreateHallRequest>({
    mutationFn: (data) => hallService.createHall(data),
    onSuccess: () => {
      toast.success("Hall created successfully");
      queryClient.invalidateQueries({ queryKey: ["halls"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create hall");
    },
  });
};
export const useGetHallLayout = (hallId: string) => {
  return useQuery<Hall>({
    queryKey: ["hallLayout", hallId],
    queryFn: () => hallService.getHallLayout(hallId),
    enabled: !!hallId,
  });
};
export const useGetAllHalls = () => {
  return useQuery<Hall[]>({
    queryKey: ["halls"],
    queryFn: () => hallService.getAllHalls(),
  });
};

export const useGetHallsByTheatre = (theatreId: string) => {
  return useQuery<Hall[], Error>({
      queryKey: ["movies", theatreId],
      queryFn: () => hallService.fetchHallsByTheatre(theatreId), 
    });
};

export const useDeleteHall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hallService.deleteHall(id),
    onSuccess: () => {
      toast.success("Hall deleted successfully", {
        className: "text-white border-success",
      });
      queryClient.invalidateQueries({ queryKey: ["halls"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete hall", {
        className: "bg-error text-white border-error",
      });
    },
  });
};

export const useUpdateHall = () => {
  const queryClient = useQueryClient();

  return useMutation<Hall, Error, Hall>({
    mutationFn: (data) => hallService.updateHall(data),
    onSuccess: () => {
      toast.success("Hall updated successfully");
      queryClient.invalidateQueries({ queryKey: ["halls"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update hall");
    },
  });
};

export const useToggleHallStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hallService.toggleHallStatus(id),
    onSuccess: (data) => {
      toast.success(
        `Hall ${data.isActive ? "activated" : "deactivated"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["halls"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to toggle hall status"
      );
    },
  });
};

export function useSeatLayout(screeningId: string) {
  return useQuery<ShowData>({
    queryKey: ["seatLayout", screeningId],
    queryFn: async () => hallService.fetchLayout(screeningId),
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });
}
