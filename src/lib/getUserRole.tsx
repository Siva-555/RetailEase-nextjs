// lib/getUserRole.ts
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

type Role = "admin" | "moderator"; // Define your roles

export async function getUserRole(): Promise<Role | null> {
  const { userId } = await auth();

  if (!userId) return null;

  try {
    const client = await clerkClient();

    // Now you can call client.users.getUser
    const user = await client.users.getUser(userId);
    const role = user.publicMetadata?.role;

    return ["admin", "moderator"].includes(role as string)
      ? (role as Role)
      : null;
  } catch (error) {
    console.error("Error getting role:", error);
    return null;
  }
}
