/**
 * Converts a date string from the format "DD/MM/YYYY" to an array of [DD, abbreviated month, YYYY].
 *
 * @param input - A date string in the format "DD/MM/YYYY" (e.g., "02/07/2025").
 * @returns A tuple containing the day, the 3-letter month abbreviation (e.g., "Jul"), and the year.
 *
 * @example
 * convertDate("02/07/2025"); // Returns: ["02", "Jul", "2025"]
 */

export function convertDate(input: string): [string, string, string] {
  const [day, month, year] = input.split('/');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthIndex = parseInt(month, 10) - 1;
  const monthAbbrev = monthNames[monthIndex];

  return [day, monthAbbrev, year];
}
