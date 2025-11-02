"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  DollarSign,
  Package,
  Receipt,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CountUp from "react-countup";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Efficiently manage your products, stock levels, and pricing with our intuitive system.",
  },
  {
    icon: Receipt,
    title: "Smart Billing",
    description:
      "Generate professional bills instantly with customer details and print/share options.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your earnings, monitor stock levels, and visualize performance with interactive charts.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Maintain customer records and transaction history for better service.",
  },
];

type FeatureCardSectionProps = {
  className?: string;
  items: {
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
};

const FeatureCardSection = ({ className, items }: FeatureCardSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {items.map((ele, ind) => (
        <motion.div
          key={ele.title}
          className="relative p-2"
          onMouseEnter={() => setHoveredIndex(ind)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Card */}
          <motion.div
            className=" size-full rounded-xl z-20 relative"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: ind * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="size-full z-20 hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 text-center">
                <ele.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {ele.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {ele.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          {/* Hover effect */}
          <AnimatePresence>
            {hoveredIndex === ind && (
              <motion.span
                className="absolute  inset-0 h-full w-full rounded-2xl  block  bg-[#38c1b61a] z-1"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function LandingPage() {

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-100 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-10">

      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-6"
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              RetailEase
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center">
          {/* <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6"
          >
            Manage Your Retail Shop
            <span className="text-blue-600 dark:text-blue-400 block">
              Like Never Before
            </span>
          </motion.h1> */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6"
          >
            Manage Your
            <ContainerTextFlip
              className="ml-4"
              words={["Retail Shop", "Inventory", "Billing", "Stock"]}
            />
            <span className="text-blue-600 dark:text-blue-400 block mt-1">
              Like Never Before
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className=" md:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto"
          >
            The smarter way to manage your entire store — from inventory and billing to insights that help your business grow.
            {/* Streamline your retail shop operations with our comprehensive
            management system. Track inventory, Generate bills, Analyze
            performance, and Grow your business efficiently. */}
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg  shadow-[0px_14px_24px_1px_#00000036]"
              >
                Start Managing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a
              href="https://youtu.be/KQUo8s27KS8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-gray-50 hover:text-gray-900 shadow"
              >
                Watch Demo
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Animated Dashboard Preview */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 relative"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0px_18px_24px_1px_#00000036] p-8 max-w-4xl mx-auto border dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center"
              >
                <Package className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {
                    <CountUp
                      end={getRandomInt(1115, 1300) || 1247}
                      delay={0.8}
                    />
                  }
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  Total Products
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center"
              >
                <DollarSign className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  ₹
                  {
                    <CountUp
                      end={getRandomInt(45000, 50000) || 45230}
                      useIndianSeparators
                      delay={0.8}
                    />
                  }
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  Monthly Earnings
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl text-center"
              >
                <AlertTriangle className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {<CountUp end={getRandomInt(10, 30) || 23} delay={1} />}
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  Low Stock Items
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our comprehensive suite of tools helps you manage every aspect of
            your retail shop business.
          </p>
        </motion.div>
        <FeatureCardSection items={features} />
      </section>

      {/* CTA Section */}
      <section className="  py-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text- mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-gray-600  mb-8 max-w-2xl mx-auto">
              Be among the first to streamline your retail shop&#39;s billing
              and inventory with RetailEase.
            </p>
            <Link href="/dashboard">
              <span className="py-2 px-3 inline-flex gap-3 font-medium sm:px-4 text-xs sm:text-sm rounded-full shadow-lg backdrop-blur-md transition-all duration-300 border bg-white/80 border-gray-200/50 text-gray-900 hover:bg-white/90">
                Get Stated Now <ArrowRight size={20} />
              </span>
            </Link>
            {/* <Link href="/dashboard">
              <motion.div
                className="px-8 py-3 bg-white text-neutral-900 font-semibold rounded-full inline-flex items-center shadow-xl shadow-white relative overflow-hidden group"
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={{
                  initial: { y: 0 },
                  animate: { y: 0 },
                  hover: {
                    y: -5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                    },
                  },
                }}
              >
                <motion.span
                  variants={{
                    initial: { y: 0 },
                    hover: { y: -2 },
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Get Started Now
                </motion.span>{" "}
                <motion.span
                  variants={{
                    initial: { x: 0 },
                    hover: { x: 5 },
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="ml-2"
                >
                  <ArrowRight size={20} />
                </motion.span>
              </motion.div>
            </Link> */}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xl font-bold">RetailEase</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500">
            © 2025 RetailEase Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
