import { z } from "zod";

export const LoginFormSchema = z.object({
  user_name: z
    .string()
    .min(1, { message: "Please provide your username or email." }),

  password: z.string().min(1, { message: "Please provide your password." }),
});

export const RegistrationFormSchema = z.object({
  full_name: z
  .string()
  .min(2, { message: "Full name must be at least 2 characters." })
  .max(50, { message: "Full name must be at most 50 characters." }),
  
  user_name: z
  .string()
  .min(1, { message: "Username must be at least 1 character." })
  .max(10, { message: "Username must be at most 10 characters." })
  .refine((val) => !val.includes("@"), {
    message: "Username cannot contain '@'.",
  }),

  email: z
    .string()
    .email({ message: "Invalid email format." })
    .min(2, { message: "Email must be at least 2 characters." }),

  phone_number: z.string().regex(/^(98|97)\d{8}$/, {
    message: "Phone number must be a valid Nepali mobile number.",
  }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      }
    ),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
export type RegistrationFormValues = z.infer<typeof RegistrationFormSchema>;
