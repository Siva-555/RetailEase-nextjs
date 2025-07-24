
"use client";

import { useUser } from "@clerk/nextjs";

type Role = "admin" | "moderator";

export function useUserRole(): Role | null {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  if (role === "admin" || role === "moderator") {
    return role;
  }

  return null; // unknown role is treated as null
}

