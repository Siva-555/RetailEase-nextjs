import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory - RetailEase",
  description: "RetailEase Inventory Management - Manage your products.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="p-4 size-full">{children}</div>;
}
