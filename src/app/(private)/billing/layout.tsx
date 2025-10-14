import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing - RetailEase",
  description: "RetailEase Billing System - Manage your sales and invoices.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
