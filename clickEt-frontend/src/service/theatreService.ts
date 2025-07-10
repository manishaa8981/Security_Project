import { FinalTheatreData } from "@/components/pageComponents/theatre/theatreForm/TheatreForm";
import { Theatre } from "@/interfaces/ITheatre";
import { axiosInstance } from "@/utils/axiosInstance";

export async function addTheatre(theatreDetails: FinalTheatreData) {
  const response = await axiosInstance.post("/theatre/add", theatreDetails);
  return response.data;
}

export const fetchAllTheatres = async (): Promise<Theatre[]> => {
  const url = "/theatre/getAll";
  const response = await axiosInstance.get(url);

  if (!response.data?.theatres) {
    return [];
  }
  return response.data.theatres;
};

export async function deleteTheatre(id: string) {
  const response = await axiosInstance.delete(`/theatre/delete/${id}`);
  return response.data;
}
