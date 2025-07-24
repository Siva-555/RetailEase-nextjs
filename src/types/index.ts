import { Prisma } from "@prisma/client";

type ProductUnits = "QTY" | "KG";

interface Inventory {
  id?: string,

  product_code: string;
  product_name: string;

  product_units: ProductUnits;

  mrp: number;
  sell_price: number;

  available_quantity: number;
  sold_quantity: number;

  modified_date: Date;
  modified_by: string;
}

interface User {
  id: string;
  email: string;
  role: "admin" | "moderator" | undefined;
}

interface ClerkError {
  errors?: { message?: string }[];
  message?: string;
  [key: string]: unknown;
}

// types.ts or types/bill.ts
export type BillInput = Omit<Prisma.BillsCreateInput, 'bill_no' | 'created_date' | 'created_by' | 'paid'>;


export type { Inventory, ProductUnits, User, ClerkError };
