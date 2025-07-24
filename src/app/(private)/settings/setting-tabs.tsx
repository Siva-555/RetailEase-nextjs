"use client";

import { useUserRole } from "@/lib/useUserRole";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

type ROLES = "admin" | "moderator";
type TABTYPE = { name: string; href: string, show: ROLES[] }
const SettingTabs = ({ tabs }: { tabs: TABTYPE[]}) => {
  const segment = useSelectedLayoutSegment();
  const role = useUserRole();
  return (
    <div className="w-fit mx-auto mt-10">
      <div className="flex mb-4 bg-gray-200 rounded-lg shadow-xs w-fit py-1 px-1 transition-colors">
        {tabs.map((tab) =>
          (role && tab.show.includes(role as ROLES)) ? (
            <Link
              key={tab.href}
              href={`/settings/${tab.href}`}
              className={cn(
                "px-4 py-1  rounded-sm text-sm font-medium transition-colors",
                segment === tab.href ? "bg-gray-50" : ""
              )}
            >
              {tab.name}
            </Link>
          ) : null
        )}
      </div>
    </div>
  );
};
export type { ROLES, TABTYPE };
export default SettingTabs;
