// import { auth } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'

import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding - RetailEase",
  description: "RetailEase Onboarding - Complete your setup.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // if ((await auth()).sessionClaims?.metadata.onboardingComplete === true) {
  //   redirect('/')
  // }

  return <>{children}</>
}