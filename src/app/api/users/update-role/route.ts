import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ClerkError } from "@/types";

export async function PATCH(req: Request) {
  const { id, role } = await req.json();
  try {
    const client = await clerkClient();
    const existingUser = await client.users.getUser(id);
    const existingMetadata = existingUser.publicMetadata || {};

    const user = await client.users.updateUser(id, {
      publicMetadata: { ...existingMetadata, role },
    });
    console.log(user);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let message = "Server error";
    console.log(err);

    if (typeof err === "object" && err !== null) {
      const clerkErr = err as ClerkError;
      if (
        "errors" in clerkErr &&
        Array.isArray(clerkErr.errors) &&
        clerkErr.errors[0]?.message
      ) {
        message = clerkErr.errors[0].message as string;
      } else if (
        "message" in clerkErr &&
        typeof clerkErr.message === "string"
      ) {
        message = clerkErr.message;
      }
    }
    return NextResponse.json(
      { error: message, status: false },
      { status: 500 }
    );
  }
}
