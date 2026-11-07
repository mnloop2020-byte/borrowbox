import type { InputHTMLAttributes, ReactElement } from "react";
import { cn } from "../lib/cn.ts";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/** shadcn-style input; existing form selectors retain visual ownership. */
export function Input({ className, ...props }: InputProps): ReactElement {
  return <input className={cn("w-full", className)} {...props} />;
}
