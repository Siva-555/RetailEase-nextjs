import { prisma } from "@/lib/db";
import { getRandomUUID } from "@/lib/server/getRandomUUID";
import { getUserEmail } from "@/lib/server/getUserInfo";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { BillInput } from "@/types";

export async function POST(request: Request) {
  try {
    const body: BillInput = await request.json();

    const created_date = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const email = await getUserEmail();
    const randomStr = getRandomUUID();
    const count = (await prisma.bills.count()) || 0;
    const formattedBillNo = `BILL-NO-${randomStr}-${String(count + 1).padStart(
      6,
      "0"
    )}`;

    if (
      !body ||
      !body.items ||
      (Array.isArray(body.items) && body.items.length === 0)
    ) {
      return NextResponse.json(
        { error: "Failed to saving bills" },
        { status: 500 }
      );
    }
    const itemsArray = Array.isArray(body.items) ? body.items : [body.items];

    for (const item of itemsArray) {
      await prisma.inventory.update({
        where: { id: item.product_id },
        data: {
          available_quantity: {
            decrement: item.quantity,
          },
          sold_quantity: {
            increment: item.quantity,
          },
        },
      });
    }
    const insertBill: Prisma.BillsCreateInput = {
      ...body,
      bill_no: formattedBillNo || crypto.randomUUID(),
      created_date,
      created_by: email || "",
    };

    const data = await prisma.bills.create({ data: insertBill });

    return NextResponse.json(
      { message: "Bill is saved successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving bills:", error);
    return NextResponse.json(
      { error: "Failed to saving bills" },
      { status: 500 }
    );
  }
}
