"use server";

import { prisma } from "@/lib/db";
import { getUserEmail, getUserPublicMetadata } from "@/lib/server/getUserInfo";
import { inventorySchema } from "@/zodSchema/inventorySchema";

import { InventoryInput } from "@/zodSchema/inventorySchema";

type FinalInventoryType = InventoryInput & {
  modified_date: Date;
  modified_by: string;
  product_code: string;
  sold_quantity: number;
  store_id: string;
};

export async function createInventory(data: InventoryInput) {
  try {
    const result = inventorySchema.safeParse(data);

    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }

    const created_date = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    const count = (await prisma.inventory.count()) || 0;

    const formattedProductCode = `P-${String(count + 1).padStart(4, "0")}`;

    const email = await getUserEmail();
    const publicMetadata = await getUserPublicMetadata();

    const finalData: FinalInventoryType = {
      ...result.data,
      product_code: formattedProductCode || crypto.randomUUID(),
      modified_by: email || "",
      modified_date: created_date,
      sold_quantity: 0,
      store_id: publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "",
    };

    const inventory = await prisma.inventory.create({
      data: finalData,
    });

    return { success: true, inventory };
  } catch (error) {
    console.error("Error in createInventory:", error);
    return {
      success: false,
      errors: { general: "An error occurred while creating inventory." },
    };
  }
}

export async function updateInventory(
  id: string,
  data: Partial<InventoryInput>
) {
  try {
    const created_date = new Date(Date.now() + 5.5 * 60 * 60 * 1000);

    const email = await getUserEmail();

    const finalData: Partial<InventoryInput> & {
      modified_by: string;
      modified_date: Date;
    } = {
      ...data,
      modified_by: email || "",
      modified_date: created_date,
    };

    const inventory = await prisma.inventory.update({
      where: { id },
      data: finalData,
    });

    console.log("test update product --", inventory);

    return { success: true };
  } catch (error) {
    console.error("Error in updateInventory:", error);
    return { success: false };
  }
}

export async function deleteProduct(id: string) {
  try {
    const inventory = await prisma.inventory.update({
      where: { id },
      data: { deleted: true },
    });

    console.log("test delete product", inventory);

    return { success: true };
  } catch (error) {
    console.error("Error in updateInventory:", error);
    return { success: false };
  }
}

export async function getInventory() {
  try {

    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : null;

    const filter_query: { deleted: boolean; store_id?: string } = {
      deleted: false,
    };
    if (store_id) filter_query["store_id"] = store_id;

    const inventory = await prisma.inventory.findMany({
      where: filter_query,
      orderBy: [{ modified_date: "desc" }, { available_quantity: "asc" }],
    });

    return { success: true, inventory };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return { success: false, inventory: [] };
  }
}
