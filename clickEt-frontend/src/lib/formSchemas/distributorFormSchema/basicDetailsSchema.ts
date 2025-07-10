import { z } from "zod";

export const DistributorSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .nonempty("Name is required")
    .max(50, "Name must be less than 50 characters"),
  commissionRate: z
    .number()
    .min(0, "Commission rate cannot be negative")
    .max(100, "Commission rate cannot exceed 100"),
  isActive: z.boolean(),
});

export type DistributorFormData = z.infer<typeof DistributorSchema>;
