"use client";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getUserInfo() {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return {
      email: user.primaryEmailAddress?.emailAddress || "",
      fullName: user.fullName || "",
      publicMetadata: user.publicMetadata,
      id: user.id,
    };
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}