import { z } from "zod";

export const inventorySchema = z.object({
  // product_code: z.string().min(1),
  product_name: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name is required")
    .max(50)
    .regex(
      /^[a-zA-Z0-9\s\-.,":]+$/,
      'Product name can only contain letters, numbers, spaces, and - " :.,'
    ),
  product_units: z.enum(["QTY", "KG"], {
    required_error: "Product unit is required",
    invalid_type_error: "Product unit must be QTY or KG",
  }),

  mrp: z.coerce
    .number({
      invalid_type_error: "MRP must be a number",
    })
    .positive("MRP must be greater than 0")
    .max(1000000),

  sell_price: z.coerce
    .number({
      invalid_type_error: "Sell price must be a number",
    })
    .positive("Sell price must be greater than 0")
    .max(1000000),

  available_quantity: z.coerce
    .number({
      invalid_type_error: "Available quantity must be a number",
    })
    .int("Available quantity must be an integer")
    .nonnegative("Available quantity cannot be negative")
    .max(5000),

  // sold_quantity: z.coerce
  //   .number({
  //     invalid_type_error: "Sold quantity must be a number",
  //   })
  //   .int("Sold quantity must be an integer")
  //   .nonnegative("Sold quantity cannot be negative"),
    
  // modified_date: z.coerce.date(), // accepts string & converts
  // modified_by: z.string().email().default("").optional(),
});

export type InventoryInput = z.infer<typeof inventorySchema>;
