import { ImageUploadResponse } from "@/interfaces/auth/IImage";
import {
  DistributorBase,
  DistributorLogoRequest,
  DistributorResponse,
} from "@/interfaces/Idistributor";
import { Hall } from "@/interfaces/IHalls";
import { axiosInstance } from "@/utils/axiosInstance";

export async function addDistributor(credentials: DistributorBase) {
  const { data } = await axiosInstance.post("/distributor/add", credentials);
  return data;
}

export const fetchAllDistributors = async (): Promise<
  DistributorResponse[]
> => {
  const url = "/distributor/getAll";
  const response = await axiosInstance.get(url);

  if (!response.data?.distributors) {
    return [];
  }
  return response.data.distributors;
};
export const fetchDistributorsByMovie = async (
  movieId: string
): Promise<DistributorResponse[]> => {
  const url = `/distributor/getByMovie/${movieId}`;
  const response = await axiosInstance.get(url);
  if (!response.data?.distributors) {
    return [];
  }
  return response.data.distributors;
};

export async function deleteDistributor(id: string) {
  const response = await axiosInstance.delete(`/distributor/delete/${id}`);
  return response.data;
}

export async function updateDistributor(updatedDistributorData) {
  const response = await axiosInstance.patch(
    `/hall/update/${updatedDistributorData._id}`,
    updatedDistributorData
  );
  return response.data;
}

export const uploadDistributorLogo = async ({
  image,
  currentImageUrl,
  distributorId,
}: DistributorLogoRequest): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("distributorId", distributorId);
  if (currentImageUrl) {
    formData.append("currentImageUrl", currentImageUrl);
  }

  const response = await axiosInstance.patch<ImageUploadResponse>(
    "/distributor/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
