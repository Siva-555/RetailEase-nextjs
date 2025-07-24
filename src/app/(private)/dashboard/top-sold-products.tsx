"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { LabelProps } from "recharts";

const chartConfig = {
  sold_quantity: {
    label: "Quantity Sold",
    color: "#16a34a",
  },
} satisfies ChartConfig;

type ChartData = {
  product_name: string;
  product_code: string;
  sold_quantity: number;
};

const renderCustomizedLabel = ({ x, y, value }: LabelProps) => {
  return (
    <text
      x={x}
      y={y && typeof y === "number" ? y - 5 : y}
      fill="#333"
      textAnchor="start"
      transform={`rotate(-25, ${x}, ${y && typeof y === "number" ? y - 5 : y})`}
      fontSize={10}
    >
      {value}
    </text>
  );
};

const TopSoldProducts = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard/top-selling-products`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (data.status === "success") {
          setChartData(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">
              Top Selling Products
            </CardTitle>
            <CardDescription>Top 10 products by quantity sold</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid
                strokeDasharray="3 3"
                className="dark:opacity-30"
              />
              <XAxis
                dataKey="product_code"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={150}
                className="text-sm"
              />
              <YAxis
                type="number"
                dataKey={"sold_quantity"}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="product_name"
                    className="w-[180px]"
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="sold_quantity"
                fill="#16a34a"
                name="Quantity Sold"
                barSize={24}
                radius={[4, 4, 4, 4]}
              >

                <LabelList
                  dataKey="product_name"
                  content={renderCustomizedLabel}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TopSoldProducts;
