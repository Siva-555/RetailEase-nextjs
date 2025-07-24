"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  // LineChart,
  // Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type FilterOption = "today" | "last_week" | "last_month";

type ChartData = {
  date: string;
  total: number;
  paid: number;
  unpaid: number;
};

const chartConfig = {
  total: {
    label: "Total",
    color: "#4f46e5",
  },
  paid: {
    label: "Paid",
    color: "#16a34a",
  },
  unpaid: {
    label: "Pending",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export default function BillStats() {
  const [filter, setFilter] = useState<FilterOption>("today");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/bills/order-stats?filter=${filter}`);
        const data = await res.json();

        setChartData(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Billing Trends </CardTitle>
            <CardDescription>
              View paid vs. unpaid bills over the selected time period.
            </CardDescription>
          </div>
          {/* <Select
            value={filter}
            onValueChange={(val: FilterOption) => setFilter(val)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_week">Last 7 Days</SelectItem>
              <SelectItem value="last_month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select> */}
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(val: FilterOption) => {
              if (val) setFilter(val);
            }}
            className=" py-0.5 text-sm data-[state=on]:bg-primary data-[state=on]:text-white "
          >
            <ToggleGroupItem
              value="today"
              className="px-2 py-0.5 text-sm border-2 border-dotted border-gray-400"
            >
              1D
            </ToggleGroupItem>
            <ToggleGroupItem
              value="last_week"
              className="px-2 py-0.5 text-sm border-y-2 border-dotted border-gray-400"
            >
              7D
            </ToggleGroupItem>
            <ToggleGroupItem
              value="last_month"
              className="px-2 py-0.5 text-sm border-2 border-dotted border-gray-400"
            >
              1M
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="px-6 space-y-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          {/* <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4f46e5"
              name="Total"
              strokeWidth={4}
            />
            <Line
              type="monotone"
              dataKey="paid"
              stroke="#16a34a"
              name="Paid"
              
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="unpaid"
              stroke="#f59e0b"
              name="Pending"
              strokeWidth={2}
            />
          </LineChart> */}

          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            {/* <Bar dataKey="total" fill={chartConfig.total.color} name={chartConfig.total.label} barSize={20} /> */}
            <Bar
              dataKey="paid"
              fill={chartConfig.paid.color}
              stackId="a"
              name={chartConfig.paid.label}
              barSize={20}
            />
            <Bar
              dataKey="unpaid"
              fill={chartConfig.unpaid.color}
              stackId="a"
              name={chartConfig.unpaid.label}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
