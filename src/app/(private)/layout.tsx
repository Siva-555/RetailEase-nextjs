import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import { SidebarUI } from "@/components/common/SiderbarUI";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import Header from "@/components/common/Header";
import { Toaster } from "@/components/ui/sonner";
import ProgessProvider from "@/components/ProgessProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Dashboard - RetailEase",
  description: "RetailEase Dashboard: See recent transactions, earnings, low stock, and top-selling products.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  // console.log("test 11 private")
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${roboto.variable} ${robotoMono.variable} antialiased h-lvh w-full flex flex-col font-sans bg-gray-50`}
        >
          <SignedOut>
            <Header />
          </SignedOut>
          <SignedIn>
            <SidebarUI />
          </SignedIn>
          <Toaster richColors />
          <ProgessProvider
          >
            <main
              className={cn("flex flex-col flex-1 ", userId ? "ml-0  md:ml-16 " : "")}
            >
              {children}
            </main>
          </ProgessProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
