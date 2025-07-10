import { z } from "zod";

export const LocationItemSchema = z.object({
  id: z.string(),
  type: z.enum(["HQ", "Branch"]),
  location: z
    .string()
    .min(1, "Address is required")
    .max(150, "Address must be less than 150 characters"),
  coordinates: z.object({
    latitude: z.string().nonempty("Latitude is required"),
    longitude: z.string().nonempty("Longitude is required"),
  }),
});

export const ContactPhoneSchema = z.object({
  type: z.enum(["INQUIRY", "SUPPORT"]),
  number: z
    .string()
    .regex(/^(?:\+977[- ]?)?\d{10}$/, "Invalid Nepali phone number format"),
  locationId: z.string(),
});

export const ContactEmailSchema = z.object({
  type: z.enum(["INQUIRY", "SUPPORT"]),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  locationId: z.string(),
});

export const LocationFormSchema = z.object({
  locations: z
    .array(LocationItemSchema)
    .min(1, "At least one address is required"),
  contacts: z.object({
    phoneNumbers: z
      .array(ContactPhoneSchema)
      .min(1, "At least one phone number is required"),
    emails: z
      .array(ContactEmailSchema)
      .min(1, "At least one email is required"),
  }),
});

export type LocationFormData = z.infer<typeof LocationFormSchema>;
export type LocationItem = z.infer<typeof LocationItemSchema>;
