import { prisma } from "@/lib/db";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bill_no: string }> }
) {
  try {
    const { bill_no } = await params;
    const publicMetadata = await getUserPublicMetadata();
    const store_id = publicMetadata && typeof publicMetadata.store_id === "string" ? publicMetadata.store_id : "";

    console.log("store_id", store_id)
    const bill_data = await prisma.bills.findFirst({
      where: {
        bill_no: bill_no,
        store_id
      },
    });

    return NextResponse.json(
      { message: "success", bill_data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetch bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bill_no: string }> }
) {
  try {
    const { bill_no } = await params;

    const bill_data = await prisma.bills.update({
      where: {
        bill_no: bill_no,
      },
      data: { paid: true },
    });

    // console.log("test --", insertBill);
    return NextResponse.json(
      { message: "success", bill_data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error failed to mark as paid", error);
    return NextResponse.json(
      { error: "Failed to mark as paid" },
      { status: 500 }
    );
  }
}
