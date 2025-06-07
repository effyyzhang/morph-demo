import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

export function getCharacterCount(text: string): number {
  if (!text) return 0;
  return text.length;
}

export function getReadingTime(text: string): number {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = getWordCount(text);
  return Math.ceil(words / wordsPerMinute);
} 