import type { ComponentProps } from "react"
import { cn } from "../lib/cn"

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary"
}

const variants = {
  primary: "bg-brand text-white hover:opacity-90",
  secondary: "bg-transparent text-brand ring-1 ring-brand ring-inset hover:bg-brand/10",
} as const

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 font-medium text-sm transition-opacity disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
