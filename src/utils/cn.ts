import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge tailwind classes with conditional classes correctly.
 * Even though we don't strictly use tailwind for everything, twMerge helps resolve conflicts 
 * if we ever pass utility classes or need to cleanly join arrays of conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
