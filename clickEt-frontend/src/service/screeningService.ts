import { axiosInstance } from "@/utils/axiosInstance";
import { CreateScreeningPayload, Screening } from "@/interfaces/IScreening";

export const createScreening = async (payload: CreateScreeningPayload) => {
  const response = await axiosInstance.post("/screening/add", {
    ...payload,
    startTime: payload.startTime.toISOString(),
    endTime: payload.endTime.toISOString(),
  });
  return response.data;
};

export const fetchAllScreenings = async (): Promise<Screening[]> => {
  const response = await axiosInstance.get("/screening/getAll");
  return response.data;
};

export const fetchScreeningsByMovie = async (
  movieId: string
): Promise<Screening[]> => {
  if (!movieId) {
    console.log("No id");
    return [];
  }
  const response = await axiosInstance.get(`/screening/byMovie/${movieId}`);
  console.log("🚀 ~ fetchScreeningsByMovie ~ response.data;:", response.data);
  return response.data;
};

export const deleteScreening = async (id: string) => {
  const response = await axiosInstance.delete(`/screening/delete/${id}`);
  return response.data;
};
