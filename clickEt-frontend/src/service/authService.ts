import { axiosInstance } from "@/utils/axiosInstance";
import {
  LoginCredentials,
  RegistrationCredentials,
  ResetCredentials,
} from "@/interfaces/auth/IAuthCredentials";

import {
  ImageUploadRequest,
  ImageUploadResponse,
} from "@/interfaces/auth/IImage";

export async function loginUser(credentials: LoginCredentials) {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
}
export async function registerUser(credentials: RegistrationCredentials) {
  const { data } = await axiosInstance.post("/auth/register", credentials);
  return data;
}

export async function sendResetEmail(credentials: { email: string }) {
  const { data } = await axiosInstance.post(
    "/auth/forget-password/",
    credentials
  );
  return data;
}

export async function resetPassword(credentials: ResetCredentials) {
  const { data } = await axiosInstance.post(
    "/auth/reset-password/",
    credentials
  );
  return data;
}

export const uploadProfileImage = async ({
  image,
  currentImageUrl,
}: ImageUploadRequest): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("image", image);

  if (currentImageUrl) {
    formData.append("currentImageUrl", currentImageUrl);
  }

  const response = await axiosInstance.patch<ImageUploadResponse>(
    "/auth//user/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export async function sendLogoutRequest() {
  const { data } = await axiosInstance.post("/auth/logout/");
  return data;
}
