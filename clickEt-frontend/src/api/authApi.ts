// src/api/authApi.ts
import { ImageUploadRequest } from "@/interfaces/auth/IImage";
import {
  loginUser,
  registerUser,
  resetPassword,
  sendLogoutRequest,
  sendResetEmail,
  uploadProfileImage,
} from "@/service/authService";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Login successful", {
        className: "text-white border-success", // Tailwind classes for success toast
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed", {
        className: "bg-error text-white border-error", // Tailwind classes for error toast
      });
    },
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};
export const useForgetPassword = () => {
  return useMutation({
    mutationFn: sendResetEmail,
    onSuccess: () => {
      toast.success("Please check your inbox for reset link.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    },
  });
};

export const usePasswordReset = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password successfully reset", {
        className: "text-white border-success",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Password Reset failed", {
        className: "bg-error text-white border-error",
      });
    },
  });
};

export const useProfileImageUpload = () => {
  return useMutation({
    mutationFn: (request: ImageUploadRequest) => uploadProfileImage(request),
    onSuccess: () => {
      toast.success("Profile Picture uploaded successfully", {
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

export const useLogout = () => {
  return useMutation({
    mutationFn: () => sendLogoutRequest(),
    onSuccess: () => {
      toast.success("Logged out successfully", {
        className: "text-white border-success",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });
};
