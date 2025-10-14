"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, DollarSign, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/theme-toggle"
// import Link from "next/link";
import { IconReceiptRupee } from "@tabler/icons-react";
// import BillStats from "@/components/BillStats"
import EarningChart from "./earning-chart";
import TopSoldProducts from "./top-sold-products";
import LatestBilling from "./latest-billing";
import CountUp from "react-countup";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_low_stock_qty: 0,

    total_available_products: 0,
    total_earning: 0,
    total_sold_quantity: 0,
    total_bills_generated: 0,
    out_of_stock_products: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/dashboard/stats`);
      const data = await res.json();
      if (data.status === "success" && data.stats)
        setStats((prev) => ({ ...prev, ...data.stats }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 md:shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Dashboard
            </h1>
            {/* <div className="flex items-center space-x-4">
              <Link href="/inventory">
                <Button variant="outline">Inventory</Button>
              </Link>
              <Link href="/billing">
                <Button>New Bill</Button>
              </Link>
            </div> */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium  dark:text-gray-200">
                  Total Products
                </CardTitle>
                <Package className="size-6  text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {<CountUp end={stats.total_available_products || 0} />}
                  {/* {stats.total_available_products.toLocaleString()} */}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">
                  Total Earnings
                </CardTitle>
                <DollarSign className="size-6 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500 ">
                  ₹{<CountUp end={stats.total_earning || 0} useIndianSeparators />}
                  {/* {stats.total_earning.toLocaleString()} */}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">
                  Total Sold Quantity
                </CardTitle>
                <Users className="size-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {<CountUp end={stats.total_sold_quantity || 0} />}
                  {/* {stats.total_sold_quantity} */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">
                  Total Bills
                </CardTitle>
                <IconReceiptRupee className="size-6 text-blue-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {<CountUp end={stats.total_bills_generated || 0} />}
                  {/* {stats.total_bills_generated} */}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">
                  Low Stock Items
                </CardTitle>
                <AlertTriangle className="size-6 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {<CountUp end={stats.total_low_stock_qty || 0} />}
                  {/* {stats.total_low_stock_qty} */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">
                  Out of Stock 
                </CardTitle>
                <AlertTriangle className="size-6 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {<CountUp end={stats.out_of_stock_products || 0} />}
                </div>
              </CardContent>
            </Card>
          </motion.div> */}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <EarningChart />
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <TopSoldProducts />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <LatestBilling />
        </motion.div>
      </div>
    </div>
  );
}
