"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";

interface DummyDetailsProps {
  className?: string;
}

const DummyDetails = ({ className }: DummyDetailsProps) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  return (
    <div
      className={cn(
        "mt-6 text-center border-t border-gray-200 pt-4 flex flex-col items-center",
        className
      )}
    >
      <p
        className={cn(
          "text-sm font-medium mb-2 cursor-pointer inline-block px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200",
          "text-gray-700  bg-gray-50 "
        )}
        onClick={() => setViewDetails((v) => !v)}
      >
        👀 Demo Account Details
      </p>
      <AnimatePresence initial={false}>
        {viewDetails && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2, ease: "easeInOut" },
            }}
            className="bg-gray-50 rounded-xl py-3 px-5 mt-2 inline-block text-left shadow-xl overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-gray-800">
                <strong className="text-gray-900 ">Admin:</strong>{" "}
                <span className="select-all">test@test.com </span>
              </p>
              <p className="text-sm text-gray-800 mb-2">
                <strong className="text-gray-900 ">Password:</strong>{" "}
                <span className="select-all">test@test.com</span>
              </p>
              <p className="text-sm text-gray-800 mt-2">
                <strong className="text-gray-900 ">Moderator:</strong>{" "}
                <span className="select-all">test2@test.com </span>
              </p>
              <p className="text-sm text-gray-800">
                <strong className="text-gray-900 ">Password:</strong>{" "}
                <span className="select-all">test2@test.com </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DummyDetails;
