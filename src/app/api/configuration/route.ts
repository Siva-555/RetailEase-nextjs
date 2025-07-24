import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";


// configuraton
export async function GET() {
  try{

    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";

    const configuration = await prisma.configuration.findFirst({
      where: { store_id: store_id },
    });
    return NextResponse.json({ success: true, configuration });
  }
  catch (error) {
    console.error("Error fetching configuration:", error);
    return NextResponse.json({ success: false, configuration: {} }, { status: 500 });
  }
}

