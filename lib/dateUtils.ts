import { format as dnsFormat} from 'date-fns';

/**
 * Formats a date according to the specified format
 * @param date The date to format (can be string, Date object, or timestamp)
 * @param format The format string (default: "dd/MM/yyyy")
 * @returns Formatted date string
 * 
 * Supported format tokens:
 * - Date: dd, MM, yyyy, yy
 * - Time: HH (24h), hh (12h), mm, ss
 * - AM/PM: a
 * - Examples:
 *   - "dd/MM/yyyy" -> "16/06/2025"
 *   - "HH:mm" -> "14:30"
 *   - "hh:mm a" -> "02:30 PM"
 *   - "dd/MM/yyyy HH:mm" -> "16/06/2025 14:30"
 *   - "dd/MM/yyyy hh:mm a" -> "16/06/2025 02:30 PM"
 */
export function formatDate(date: string | Date | number, format: string = "dd/MM/yyyy"): string {
  try {
    // Convert input to Date object
    const dateObj = new Date(date);
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date);
      return '';
    }

    // Validate format string
    if (!format) {
      console.warn('Invalid format string provided');
      return '';
    }

    // Use date-fns format function
    return dnsFormat(dateObj, format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
