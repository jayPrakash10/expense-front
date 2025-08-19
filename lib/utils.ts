import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PAYMENT_MODES } from "@/constants/paymentModes"
import { formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns boolean indicating if the email is valid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional checks
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const [local, domain] = parts;
  if (local.length > 64 || domain.length > 255) return false;
  
  return emailRegex.test(email);
}

/**
 * Returns the label for a given payment mode value
 * @param value The payment mode value to get label for
 * @returns The label string or empty string if not found
 */
export function getPaymentModeLabel(value: string): string {
  const mode = PAYMENT_MODES[value as keyof typeof PAYMENT_MODES];
  return mode?.label || '';
}

// Calculate days in month and create date list
export function calculateMonthDays (month: number, year: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        date: formatDate(date, "yyyy-MM-dd"),
        amount: 0,
      };
    });
  };

/**
 * Generates a random hex color code
 * @returns A string representing a random hex color code (e.g., "#a1b2c3")
 */
export function generateRandomColor(): string {
  // Generate random values for red, green, and blue components
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  // Convert each component to a two-digit hex string and concatenate
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}