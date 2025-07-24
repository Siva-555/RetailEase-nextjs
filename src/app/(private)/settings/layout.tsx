// app/settings/layout.tsx
import { ReactNode } from "react";
import SettingTabs from "./setting-tabs";
import type {  TABTYPE } from "./setting-tabs";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const tabs:TABTYPE[] = [
    { name: "Configuration", href: "configuration", show: ["admin"] },
    { name: "User Management", href: "user-management", show: ["admin"] },
    { name: "Profile", href: "user-profile", show: ["admin", "moderator"] },
  ];

  return (
    <div className="size-full ">
      <SettingTabs tabs={tabs} />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
