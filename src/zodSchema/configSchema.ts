import { z } from "zod";

export const ConfigSchema = z.object({
  taxAmount : z.coerce
    .number({
      required_error: "Tax amount is required",
      invalid_type_error: "Tax amount must be a number",
    })
    .min(0, "Tax must be 0 or more")
    .max(70, "Tax cannot be more than 70%"),
  lowStockValue: z.coerce
    .number({
      required_error: "Low stock value is required",
      invalid_type_error: "Low stock value must be a number",
    })
    .min(0, "Low stock value must be non-negative")
    .max(10000, "Low stock value cannot exceed 10,000"),
});

export type ConfigSchemaType = z.infer<typeof ConfigSchema>;
