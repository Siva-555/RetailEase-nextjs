import React, { useEffect, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getTimeAgoLabel } from "@/lib/utils";
import Loader from "@/components/common/loader";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import { IconCircleCheckFilled } from "@tabler/icons-react";

// customer-name, total, quatity paid

type latestData = {
  customer_name: string;
  total: number;
  total_sold_quantity: number;
  paid: number;
  created_date: Date;
  bill_no: string;
};

const LatestBilling = () => {
  const [latestData, setLatestData] = useState<latestData[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/dashboard/latest-bills`, {
            signal: controller.signal,
          });
          const data = await res.json();

          if (data.status === "success") {
            startTransition(() => {
              setLatestData(data.data);
            });
          }
        } catch (err) {
          console.log(err);
        }
      });
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white flex justify-between">
          Recent Transactions
          <Link
            target="_blank"
            href={"/billing/history"}
            className="text-right hover:underline underline-offset-2"
          >
            {" "}
            See all{" "}
          </Link>
        </CardTitle>
        <CardDescription>Latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {latestData.length === 0 && !isPending ? (
          <div className="text-center">No Transactions</div>
        ) : (
          ""
        )}

        {isPending ? <Loader /> : ""}
        <div className="space-y-4">
          {latestData.map((ele, index) => (
            <div
              key={index}
              className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div className="w-full">
                <p className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  Customer:{" "}
                  <span className="font-[400] inline-block text-sm first-letter:uppercase">
                    {ele.customer_name}
                  </span>
                  <IconCircleCheckFilled size={18} className={cn("cursor-pointer", ele.paid ? "text-green-500 ": "text-gray-400" )} title={ele.paid ? "Paid ": "Payment pending"}/>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span>{`Amount: ₹${ele.total}`},</span>
                  <span className="ml-2">{`Qty: ${ele.total_sold_quantity}`}</span>
                </p>
              </div>
              <div className="flex flex-row items-center w-full justify-between  md:flex-col md:justify-between md:items-end md:mr-5 text-gray-500 dark:text-gray-400">
                <Link
                  className="flex items-center md:mb-2 hover:text-blue-500 focus:text-blue-500"
                  href={
                    ele?.bill_no ? `/billing/view-bill/${ele.bill_no}` : "#"
                  }
                  target="_blank"
                >
                  <SquareArrowOutUpRight size={18} />
                </Link>
                <span className="text-xs ">
                  {getTimeAgoLabel(ele.created_date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestBilling;
