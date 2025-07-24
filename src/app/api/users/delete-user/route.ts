import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { id } = await req.json();
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: true }, { status: 500 });
  }
}
