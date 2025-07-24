
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getUserEmail(): Promise<string | "" | null> {
  try {
    const { userId } = await auth();
  
    if (!userId) return null;

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    return user.primaryEmailAddress?.emailAddress || ""

  } catch (error) {
    console.error("Error getting role:", error);
    return null;
  }
}
export async function getUserPublicMetadata() {
  try {
    const { userId } = await auth();
  
    if (!userId) return null;
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return user.publicMetadata;

  } catch (error) {
    console.error("Error getting role:", error);
    return null;
  }
}
