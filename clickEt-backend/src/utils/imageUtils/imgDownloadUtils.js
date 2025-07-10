import http from "http";
import https from "https";
import { Buffer } from "buffer";

export const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    // Choose the appropriate module based on the URL protocol
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        const chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
      })
      .on("error", (error) => {
        console.error(`Error downloading image from ${url}:`, error.message);
        reject(error);
      });
  });
};