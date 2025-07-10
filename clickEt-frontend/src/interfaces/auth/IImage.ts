export type ImageFile = File;
export interface ImageUploadRequest {
  image: ImageFile;
  currentImageUrl?: string;
}

export interface ImageUploadResponse {
  message: string;
  imageUrl: string;
}
