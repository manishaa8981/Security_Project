import {
  CreateHallRequest,
  CreateHallResponse,
  Hall,
} from "@/interfaces/IHalls";
import { axiosInstance } from "@/utils/axiosInstance";

export const hallService = {
  createHall: async (data: CreateHallRequest): Promise<CreateHallResponse> => {
    const response = await axiosInstance.post<CreateHallResponse>(
      "/hall/add",
      data
    );
    return response.data;
  },
  getHallLayout: async (hallId: string): Promise<Hall> => {
    const response = await axiosInstance.get(`/hall/${hallId}`);
    return response.data;
  },
  getAllHalls: async (): Promise<Hall[]> => {
    const response = await axiosInstance.get(`/hall/getAll`);
    return response.data;
  },

  fetchHallsByTheatre: async (theatreId: string): Promise<Hall[]> => {
    try {
      const response = await axiosInstance.get(`hall/theatre/${theatreId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching halls by theatre:", error);
      throw error;
    }
  },

  deleteHall: async (id: string) => {
    const response = await axiosInstance.delete(`/hall/delete/${id}`);
    return response.data;
  },

  updateHall: async (updatedHallData: Hall) => {
    const response = await axiosInstance.patch(
      `/hall/update/${updatedHallData._id}`,
      updatedHallData
    );
    return response.data;
  },

  toggleHallStatus: async (id: string): Promise<Hall> => {
    const response = await axiosInstance.patch(`/hall/toggle/${id}`);
    return response.data.hall;
  },
  fetchLayout: async (screeningId: string) => {
    const response = await axiosInstance.get(
      `/screening/${screeningId}/layout`
    );
    return {
      seatGrid: response.data.seatGrid,
      finalPrice: response.data.price,
    };
  },
};
