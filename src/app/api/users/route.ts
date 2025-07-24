// /app/api/users/route.ts
import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clerkClient();

    const currentUser = await client.users.getUser(userId);
    const storeId = currentUser.publicMetadata.store_id as string;

    if (!storeId) {
      return NextResponse.json({ error: "No store_id found for user" }, { status: 400 });
    }

    // 🔍 Search for users with matching store_id
    const allUsersResponse = await client.users.getUserList();
    const allUsers = allUsersResponse.data ?? [];

    const storeUsers = allUsers.filter(
      (user) => user.publicMetadata.store_id === storeId
    );

    const formatted = storeUsers.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      role: user.publicMetadata.role ?? "",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
