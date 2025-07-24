import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  formatDistanceToNowStrict,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  subMinutes,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidPhone = (phone: string) => /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/.test(phone);

export function formatUTCDate(dateStr: Date | null | string): string {
  if(!dateStr) return "";
  const date = new Date(dateStr);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year}/ ${formattedHours}:${minutes} ${ampm}`;
}



export function getTimeAgoLabel(date: Date | string): string {
  const targetDate = subMinutes(new Date(date), 5.5 * 60);

  const now = new Date();
  
  const hoursDiff = differenceInHours(now, targetDate);
  const daysDiff = differenceInDays(now, targetDate);
  const monthsDiff = differenceInMonths(now, targetDate);
  const yearsDiff = differenceInYears(now, targetDate);

  if (hoursDiff < 24) {
    return `${hoursDiff === 0 ? "Just now" : `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`}`;
  }

  if (daysDiff < 31) {
    return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
  }

  if (yearsDiff === 0) {
    const remainingDays = daysDiff % 30;
    return `${monthsDiff} month${monthsDiff > 1 ? "s" : ""}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}` : ""} ago`;
  }

  return formatDistanceToNowStrict(targetDate, { addSuffix: true }); // fallback
}
