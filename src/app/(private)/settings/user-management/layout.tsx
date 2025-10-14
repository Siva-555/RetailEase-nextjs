import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "RetailEase User Management - Manage your users and roles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="p-4 size-full">{children}</div>;
}
