"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/Sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconBuildingStore,
  IconPackage,
  IconReceiptRupee,
  IconSettings,
} from "@tabler/icons-react";
import { motion } from "motion/react";
// import { cn } from "@/lib/utils";
import { CircleUser, FileClock, ShoppingCart } from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";

export function SidebarUI() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      show: ["admin"],
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Inventory",
      href: "/inventory",
      show: ["admin"],
      icon: (
        <IconPackage className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Billing",
      href: "/billing",
      show: ["admin", "moderator"],
      icon: (
        <IconReceiptRupee className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Billing History",
      href: "/billing/history",
      show: ["admin", "moderator"],
      icon: (
        <FileClock className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    // {
    //   label: "Profile",
    //   href: "/user-profile",
    //   icon: (
    //     <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    //   ),
    // },
    {
      label: "Store Info",
      href: "/onboarding",
      show: ["admin"],
      icon: (
        <IconBuildingStore className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      show: ["admin", "moderator"],
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const email = user?.emailAddresses[0]?.emailAddress;
  const username = user?.username;

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 h-full fixed z-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => {
              return link.show.includes(
                user?.publicMetadata?.role as string
              ) ? (
                <SidebarLink key={idx} link={link} />
              ) : null;
            })}
            <SignOutButton>
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#",
                  icon: (
                    <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
              />
            </SignOutButton>
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: username || email || "User",
              href: "#",
              icon: (
                <CircleUser
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <ShoppingCart className="h-7 w-6  text-blue-600 dark:text-blue-400" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        RetailEase
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <ShoppingCart className="h-7 w-6  text-blue-600 dark:text-blue-400" />
    </a>
  );
};
