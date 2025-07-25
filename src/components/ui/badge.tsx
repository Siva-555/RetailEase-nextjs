import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        success:
          "border-transparent bg-green-600 text-white [a&]:hover:bg-green-700 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-400/40 dark:bg-green-500",
        info:
          "border-transparent bg-blue-600 text-white [a&]:hover:bg-blue-700 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-400/40 dark:bg-blue-500",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600 focus-visible:ring-yellow-500/20 dark:focus-visible:ring-yellow-400/40 dark:bg-yellow-400",
        warningLight:
          "border-transparent bg-yellow-100 text-yellow-700 [a&]:hover:bg-yellow-300 focus-visible:ring-yellow-300/20 dark:focus-visible:ring-yellow-300/40 dark:bg-yellow-400",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
