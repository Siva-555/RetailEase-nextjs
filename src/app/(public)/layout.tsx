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

export const metadata: Metadata = {
  title: "RetailEase - Your Retail Management Solution",
  description:
    "Manage your retail business with ease using RetailEase. Streamline operations, track sales, and enhance customer experience.",
  keywords: "retailease, ration shop,  inventory management, billing system, shop management, POS system",
  
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${roboto.variable} ${robotoMono.variable} antialiased h-lvh w-full flex flex-col font-sans bg-gray-50`}
        >
          <Toaster richColors />
          <ProgessProvider>
            <main className={cn("flex flex-col flex-1 ")}>{children}</main>
          </ProgessProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
