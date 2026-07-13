/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert a snake_case or UPPER_CASE string to Title Case.
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split("_")
    .map(capitalize)
    .join(" ");
};

/**
 * Truncate a string to a given max length, appending "...".
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return "";
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

/**
 * Returns initials from a full name (e.g., "John Doe" → "JD").
 */
export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Check if a value is empty (null, undefined, "", [], {}).
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clone an object using JSON serialization.
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Build query string from a params object, skipping null/undefined/empty.
 */
export const buildQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return query ? `?${query}` : "";
};
