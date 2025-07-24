import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";

type product_filter_query = { deleted: boolean; store_id: string }

export async function GET() {
  try{
    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";


    const stats = {
      total_available_products: 0,
      total_earning: 0, 
      total_sold_quantity: 0,
      total_bills_generated: 0,

      total_low_stock_qty: 0
    }

    // 1 - inventory
    const product_filter_query: product_filter_query = {
      deleted: false,
      store_id: store_id
    };

    const products = await prisma.inventory.findMany({
      where: product_filter_query,
    });
    const config = await prisma.configuration.findFirst({
      where: { store_id: store_id },
    });

    products.forEach((ele)=>{
      if(ele.available_quantity>0) stats.total_available_products += 1
      if(ele.available_quantity < (config?.lowStockValue || 10)) stats.total_low_stock_qty +=1;
    })

    // 2 -  bills
    const bills = await prisma.bills.findMany({ where: { store_id: store_id } })
    bills.forEach((ele)=>{
      if(ele.paid) stats.total_earning += ele.total;

      if(ele.items.length>0){
        stats.total_sold_quantity += ele.items.reduce((acc, val)=>acc+val.quantity, 0);
      }
    })

    stats.total_bills_generated = bills.length;

    return NextResponse.json({status: "success", stats});
  }
  catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
