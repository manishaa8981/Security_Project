import { z } from "zod";

export const movieSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Nepali", "Bollywood", "Hollywood"]),
  description: z.string().min(1, "Description is required"),
  releaseDate: z.date(),
  duration_min: z.number().min(1, "Duration must be at least 1 minute"),
  language: z.enum(["Nepali", "Hindi", "English"]),
  posterURL: z.object({
    sm: z.string().url("Invalid URL for small poster").min(1, "Small poster URL is required"),
    lg: z.string().url("Invalid URL for large poster").min(1, "Large poster URL is required"),
  }),
  trailerURL: z.string().url("Invalid URL").min(1, "Trailer URL is required"),
  status: z.enum(["showing", "upcoming"]),
});

export type MovieFormValues = z.infer<typeof movieSchema>;