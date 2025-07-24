// userSchema.ts
import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["admin", "moderator"], {
    required_error: "Role is required",
  }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password too long" }),
});

export const editUserSchema = z.object({
  role: z.enum(["admin", "moderator"], {
    required_error: "Role is required",
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
