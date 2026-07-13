import { format, parseISO, isValid } from "date-fns";

/**
 * Format a date string or Date object to a readable format.
 * @param {string|Date} date
 * @param {string} formatStr - default: "dd MMM yyyy"
 */
export const formatDate = (date, formatStr = "dd MMM yyyy") => {
  if (!date) return "—";
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, formatStr) : "—";
};

/**
 * Format a date string to "dd MMM yyyy, hh:mm a"
 */
export const formatDateTime = (date) => {
  return formatDate(date, "dd MMM yyyy, hh:mm a");
};

/**
 * Returns true if the date is in the past.
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const parsed = typeof date === "string" ? parseISO(date) : date;
  return isValid(parsed) && parsed < new Date();
};
