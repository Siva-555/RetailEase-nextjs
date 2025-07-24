import { getUserPublicMetadata } from "@/lib/server/getUserInfo";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const userPublicMetadata = await getUserPublicMetadata();
  if (userPublicMetadata?.role === "admin") {
    redirect("/settings/configuration");
  } else {
    redirect("/settings/user-profile");
  }
}
