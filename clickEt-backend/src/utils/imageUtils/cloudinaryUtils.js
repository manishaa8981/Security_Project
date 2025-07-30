import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// export const convertImagesToWebP = async (imageBuffers, options = {}) => {
//   const defaultOptions = {
//     quality: 80,
//     maxWidth: 2000,
//     maxHeight: 2000,
//   };

//   const config = { ...defaultOptions, ...options };
//   try {
//     const webpBuffers = await Promise.all(
//       imageBuffers.map(async (buffer) => {
//         return sharp(buffer)
//           .resize(config.maxWidth, config.maxHeight, {
//             fit: "inside",
//             withoutEnlargement: true,
//           })
//           .toFormat("webp", { quality: config.quality })
//           .toBuffer();
//       })
//     );
//     return webpBuffers;
//   } catch (error) {
//     console.error("Error converting images to WebP:", error);
//     throw error;
//   }
// };
import { fileTypeFromBuffer } from "file-type"; // ADD THIS

export const convertImagesToWebP = async (imageBuffers, options = {}) => {
  const defaultOptions = {
    quality: 80,
    maxWidth: 2000,
    maxHeight: 2000,
  };

  const config = { ...defaultOptions, ...options };

  try {
    const webpBuffers = await Promise.all(
      imageBuffers.map(async (buffer, idx) => {
        const fileType = await fileTypeFromBuffer(buffer);
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!fileType || !allowedTypes.includes(fileType.mime)) {
          throw new Error(`Invalid image format at index ${idx}`);
        }

        return sharp(buffer)
          .resize(config.maxWidth, config.maxHeight, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFormat("webp", { quality: config.quality })
          .toBuffer();
      })
    );

    return webpBuffers;
  } catch (error) {
    console.error("Error converting images to WebP:", error);
    throw error;
  }
};

export const uploadImagesToCloudinary = async (imageBuffers, folder) => {
  try {
    const uploadPromises = imageBuffers.map((buffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading images to Cloudinary:", error);
    throw error;
  }
};

export const processAndUploadImages = async (
  imageBuffers,
  folder,
  options = {}
) => {
  try {
    const webpBuffers = await convertImagesToWebP(imageBuffers, options);
    const uploadResults = await uploadImagesToCloudinary(webpBuffers, folder);
    const imageUrls = uploadResults.map((result) => result.secure_url);
    return imageUrls;
  } catch (error) {
    console.error("Error processing and uploading images:", error);
    throw error;
  }
};

// Function to extract public_id from the URL
const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/"); // Skip 'upload' and version
  return publicIdWithExtension.split(".")[0]; // Remove file extension
};

// Function to delete the image using the provided URL
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from the URL
    const publicId = await extractPublicIdFromUrl(imageUrl);

    // Delete the image using the public_id
    const result = await cloudinary.api.delete_resources([publicId], {
      type: "upload",
      resource_type: "image",
    });

    if (result.deleted[publicId] === "deleted") {
      console.log("Image deleted successfully:", publicId);
    } else {
      console.error("Failed to delete image:", result);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
// hiii
