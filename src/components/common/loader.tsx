import { cn } from "@/lib/utils";

import React, { HTMLAttributes } from "react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Loader({ className, ...props }: LoaderProps) {
  return (
    <div className={cn("size-full flex justify-center items-center", className)} {...props}>
      <span className="loader"></span>
    </div>
  );
}
