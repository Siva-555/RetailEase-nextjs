// schema.ts
import { z } from "zod";

export const onboardingSchema = z.object({
  store_name: z
    .string()
    .min(1, "Store name is required")
    .max(50, "Store name must be less than 50 characters"),
  store_address: z
    .string()
    .min(1, "Store address is required")
    .max(100, "Store address must be less than 100 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be a 6-digit number"),
  mobile_no: z.string().regex(/^[6-9]\d{9}$/, "Mobile number must be valid"),
  gst_no: z
    .string()
    .max(30, "GST number must be less than 30 characters")
    .optional()
    .or(z.literal("")),
  fssai_no: z
    .string()
    .max(30, "FSSAI number must be less than 30 characters")
    .optional()
    .or(z.literal("")),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
