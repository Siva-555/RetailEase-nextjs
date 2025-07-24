"use server";

import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";
import { Bills } from "@prisma/client";

export async function getAllBillDetails(): Promise<{
  success: boolean;
  data: Bills[];
}> {
  try {
    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";


    const billData = await prisma.bills.findMany({
      where: { store_id: store_id },
      orderBy: {
        created_date: "desc",
      },
    });

    return { success: true, data: billData };
  } catch (error) {
    console.error("Error fetching bill details:", error);
    return { success: false, data: [] };
  }
}
