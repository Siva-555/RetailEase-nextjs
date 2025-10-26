import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "RetailEase - Your Retail Management Solution",
  description:
    "Manage your retail business with ease using RetailEase. Streamline operations, track sales, and enhance customer experience.",
  keywords: [
    "RetaileEase",
    "Ration Shop",
    "Inventory Management",
    "Billing System",
    "Shop Management",
    "POS system"
  ],
  openGraph: {
    title: "RetailEase - Simplify Your Shop Management",
    description:
      "Smart billing and inventory management system for ration shops and small retailers.",
    url: `${BASE_URL}`,
    siteName: "RetailEase",
    images: [
      {
        url: `${BASE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: "RetailEase - Smart Retail Management",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RetailEase - Your Retail Management Solution",
    description:
      "Streamline your shop operations with billing, inventory, and analytics tools.",
    images: [`${BASE_URL}/og-image.png`],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <body
          className={`${roboto.variable} ${robotoMono.variable} antialiased h-lvh w-full flex flex-col font-sans bg-gray-50`}
        >
          <Toaster richColors />
          <ProgessProvider>
            <main className={cn("flex flex-col flex-1 max-w-[96rem] mx-auto w-full")}>{children}</main>
          </ProgessProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
