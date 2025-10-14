import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing History - RetailEase",
  description: "RetailEase Billing System - View your billing history and invoices.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="p-4 size-full bg-gray-50">{children}</div>;
}
