import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";


// products
export async function GET() {
  try{

    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";

    const bills_records = await prisma.bills.findMany({
      where: {
        store_id,
      },
      orderBy: [{ created_date: "desc" }],
      take: 5,
      select:{
        created_date: true,
        paid: true,
        customer_name: true,
        items: true,
        total: true,
        bill_no: true,
      }
    });

    const formated = bills_records.map((ele)=>{
      const obj = {
        created_date: ele.created_date, 
        bill_no: ele.bill_no,
        paid: ele.paid,
        customer_name: ele.customer_name,
        total: ele.total,
        total_sold_quantity: 0,
      }
      if(ele.items.length>0){
        obj.total_sold_quantity = ele.items.reduce((acc, val)=>acc+val.quantity, 0);
      }
      return obj;
    })
    return NextResponse.json({data: formated, status: "success"});    
  }
  catch (error) {
    console.error("Error fetching latest bills", error);
    return NextResponse.json({ error: "Failed to fetch latest bills", status: "fail" }, { status: 500 });
  }
}
