import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserPublicMetadata } from "@/lib/server/getUserInfo";
import { ClerkError } from "@/types";

export async function POST(req: Request) {
  const { email, password, role } = await req.json();
  try {
    if (!email || !password || !role)
      return NextResponse.json({ success: true }, { status: 400 });

    const metadata = await getUserPublicMetadata();

    if (!metadata || !metadata.store_id) {
      return NextResponse.json(
        { success: false, error: "Creator does not have a store_id" },
        { status: 400 }
      );
    }

    console.log(metadata, email, password, role);

    const client = await clerkClient();
    const user = await client.users.createUser({
      emailAddress: [email],
      password: password,
      publicMetadata: {
        role,

        onboardingComplete: true,
        store_id: metadata.store_id,
        store_name: metadata.store_name,
        store_address: metadata.store_address,
        pincode: metadata.pincode,
        mobile_no: metadata.mobile_no,
        gst_no: metadata.gst_no || "",
        fssai_no: metadata.fssai_no || "",
      },
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


