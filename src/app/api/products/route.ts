import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";


// products / inventory
export async function GET() {
  try{

    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";

    const products = await prisma.inventory.findMany({
      where: {
        deleted: false,
        store_id,
      },
      orderBy: [{ modified_date: "desc" }, { available_quantity: "asc" }],
    });
    return NextResponse.json(products);
  }
  catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

