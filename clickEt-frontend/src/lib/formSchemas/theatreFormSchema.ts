import { z } from "zod";

export const locationSchema = z.object({
  locations: z.array(
    z.object({
      id: z.string(),
      address: z.string().nonempty("Location's address is required"),
      coordinates: z.object({
        latitude: z.string().nonempty("Latitude is required"),
        longitude: z.string().nonempty("Longitude is required"),
      }),
      commissionRate: z
        .number()
        .min(0, "Rate must be between 0 and 100")
        .max(100),
    })
  ),
  contacts: z.object({
    phoneNumbers: z.array(
      z.object({
        type: z
          .enum(["INQUIRY", "SUPPORT"])
          .refine((value) => ["INQUIRY", "SUPPORT"].includes(value), {
            message: "Invalid phone number type",
          }),
        locationId: z.string(),

        number: z
          .string()
          .nonempty("Phone number is required")
          .regex(
            /^(?:\+977[- ]?)?\d{10}$/,
            "Invalid Nepali phone number format"
          ),
      })
    ),
    emails: z.array(
      z.object({
        type: z
          .enum(["INQUIRY", "SUPPORT"])
          .refine((value) => ["INQUIRY", "SUPPORT"].includes(value), {
            message: "Invalid email type",
          }),
        locationId: z.string(),
        email: z.string().email("Invalid email format"),
      })
    ),
  }),
});

export const theatreSchema = z.object({
  name: z.string().min(2, "Name must be between 2 and 100 characters").max(100),
  locations: z.array(
    z.object({
      address: z.string().nonempty("Location's address is required"),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      commissionRate: z
        .number()
        .min(0, "Rate must be between 0 and 100")
        .max(100),
    })
  ),
  contacts: z.array(
    z.object({
      location: z.string().nonempty("Location is required"),
      phoneNumbers: z.array(
        z.object({
          type: z
            .enum(["INQUIRY", "SUPPORT"])
            .refine((value) => ["INQUIRY", "SUPPORT"].includes(value), {
              message: "Invalid phone number type",
            }),
          number: z.string().nonempty("Phone number is required"),
        })
      ),
      emails: z.array(
        z.object({
          type: z
            .enum(["INQUIRY", "SUPPORT"])
            .refine((value) => ["INQUIRY", "SUPPORT"].includes(value), {
              message: "Invalid email type",
            }),
          email: z.string().email("Invalid email format"),
        })
      ),
    })
  ),
  isActive: z.boolean().optional(),
});
