import {
  addDistributor,
  deleteDistributor,
  fetchAllDistributors,
  fetchDistributorsByMovie,
  uploadDistributorLogo,
} from "@/service/distributorService";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DistributorLogoRequest,
  DistributorResponse,
} from "@/interfaces/Idistributor";

export const useAddDistributor = () => {
  return useMutation({
    mutationFn: addDistributor,
    onSuccess: () => {
      toast.success("Distributor Added Successfully", {
        className: "text-white border-success",
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Adding Distributor failed",
        {
          className: "bg-error text-white border-error",
        }
      );
    },
  });
};

export const useFetchAllDistributors = () => {
  return useQuery<DistributorResponse[], Error>({
    queryKey: ["distributors"],
    queryFn: () => fetchAllDistributors(),
  });
};
export const useFetchDistributorsByMovie = (movieId: string) => {
  return useQuery<DistributorResponse[], Error>({
    queryKey: ["distributorsByMovie", movieId],
    queryFn: () => fetchDistributorsByMovie(movieId),
  });
};

export const useDeleteDistributor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDistributor(id),
    onSuccess: () => {
      toast.success("Distributor deleted successfully", {
        className: "text-white border-success",
      });
      // Invalidate and refetch the distributors list
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete distributor",
        {
          className: "bg-error text-white border-error",
        }
      );
    },
  });
};

export const useDistributorLogoUpload = () => {
  return useMutation({
    mutationFn: (request: DistributorLogoRequest) =>
      uploadDistributorLogo(request),
    onSuccess: () => {
      toast.success("Distributor Logo uploaded successfully", {
        className: "text-white border-success",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });
};
