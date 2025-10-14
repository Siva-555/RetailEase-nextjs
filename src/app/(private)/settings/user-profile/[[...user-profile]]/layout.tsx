import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "RetailEase User Profile - Manage your profile settings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
