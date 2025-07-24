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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type FilterOption = "today" | "last_week" | "last_month";

type ChartData = {
  date: string;
  total: number;
};

const chartConfig = {
  total: {
    label: "Earnings",
    color: "#f0b100",
  },
} satisfies ChartConfig;

const EarningChart = () => {
  const [filter, setFilter] = useState<FilterOption>("today");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard/earning?filter=${filter}`, {
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
  }, [filter]);

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">Earnings Overview</CardTitle>
            <CardDescription>Track your earnings over time</CardDescription>
          </div>
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
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid
                strokeDasharray="3 3"
                className="dark:opacity-30"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="total"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />

              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="total" fill={`var(--color-total)`} barSize={24} radius={[4, 4, 4, 4]}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EarningChart;
