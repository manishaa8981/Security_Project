import { z } from "zod";

export const DistributionRightFormSchema = z.object({
  movieId: z.string().nonempty("Movie is required"),
  commissionRate: z
    .number()
    .min(0, "Commission rate cannot be negative")
    .max(100, "Commission rate cannot exceed 100"),
  territories: z.array(z.string()).min(1, "At least one territory is required"),
  validFrom: z.string().nonempty("Valid From date is required"),
  validUntil: z.string().nonempty("Valid Until date is required"),
});

export type DistributionRightFormData = z.infer<
  typeof DistributionRightFormSchema
>;
