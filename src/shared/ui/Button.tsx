"use client";

import { cn } from "@/shared/utils/cn";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "cancel" | "icon";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1",
  md: "h-9 px-4 text-sm gap-1.5",
  lg: "h-11 px-5 text-base gap-2",
};

const variants: Record<Exclude<Variant, "icon">, string> = {
  primary: "bg-[#01959F] text-white hover:bg-[#018690] focus:ring-[#01959F]",
  secondary: "bg-[#FBC037] text-black hover:bg-[#E3AA2F] focus:ring-[#FBC037]",
  cancel:
    "border border-[#E0E0E0] bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
};

export default function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading,
  fullWidth,
  className,
  children,
  ...rest
}: Props) {
  if (variant === "icon") {
    // icon-only (square)
    const squareBySize: Record<Size, string> = {
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-11 w-11",
    };
    return (
      <button
        {...rest}
        className={cn(
          base,
          squareBySize[size],
          "border border-[#E0E0E0] bg-white font-bold text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
          fullWidth && "w-full",
          className,
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </button>
    );
  }

  return (
    <button
      {...rest}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && leftIcon}
      <span className="whitespace-nowrap font-bold">{children}</span>
      {!loading && rightIcon}
    </button>
  );
}
