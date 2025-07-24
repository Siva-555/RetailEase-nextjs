import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatInTimeZone } from "date-fns-tz";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";

export async function GET(req: NextRequest) {
  try {
    const filter = req.nextUrl.searchParams.get("filter");
    const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const fromDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    let days = 1;

    switch (filter) {
      case "last_week":
        fromDate.setDate(now.getDate() - 6);
        days = 7;
        break;
      case "last_month":
        fromDate.setDate(now.getDate() - 29);
        days = 30;
        break;
      case "today":
      default:
        fromDate.setTime(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );
        break;
    }

    const publicMetadata = await getUserPublicMetadata();
    const store_id =
      publicMetadata && typeof publicMetadata.store_id === "string"
        ? publicMetadata.store_id
        : "";

    const allBills = await prisma.bills.findMany({
      where: {
        created_date: {
          gte: fromDate,
          lte: now,
        },
        store_id,
        paid: true,
      },
      select: {
        created_date: true,
        total: true,
      },
    });

    const countsMap: Record<string, { total: number }> = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(fromDate);
      date.setDate(fromDate.getDate() + i);
      const formattedDate = formatInTimeZone(date, "UTC", "yyyy-MM-dd");
      countsMap[formattedDate] = { total: 0 };
    }

    allBills.forEach((bill) => {
      const date = formatInTimeZone(bill.created_date, "UTC", "yyyy-MM-dd");
      if (countsMap[date]) {
        countsMap[date].total += bill.total;
      }
    });

    const data = Object.entries(countsMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    return NextResponse.json({ data, total: allBills.length, status: "success" });
  } catch (error) {
    console.error("Error dashboard earning", error);
    return NextResponse.json(
      { error: "Error dashboard earning", status: "fail" },
      { status: 500 }
    );
  }
}
