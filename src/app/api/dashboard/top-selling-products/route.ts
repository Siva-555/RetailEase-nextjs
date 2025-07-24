import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";


// products
export async function GET() {
  try{

    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";

    const products = await prisma.inventory.findMany({
      where: {
        deleted: false,
        store_id,
      },
      orderBy: [{ sold_quantity: "desc" }],
      take: 10,
      select: {
        sold_quantity: true,
        product_name: true,
        product_code: true,
      },
    });
    
    return NextResponse.json({data: products, status: "success"});
  }
  catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products", status: "fail" }, { status: 500 });
  }
}
