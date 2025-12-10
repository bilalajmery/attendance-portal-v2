import { startOfWeek, endOfWeek, format, isWithinInterval, isSunday, isValid } from "date-fns";

/**
 * Get the start and end of the current week (Monday to Sunday)
 */
export const getCurrentWeekRange = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  
  return { start, end };
};

/**
 * Check if a date is within the current week
 */
export const isInCurrentWeek = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (!isValid(dateObj)) return false;

  const { start, end } = getCurrentWeekRange();
  
  return isWithinInterval(dateObj, { start, end });
};

/**
 * Filter holidays that are in the current week (excluding Sundays)
 */
export const getCurrentWeekHolidays = <T extends { date: string; reason?: string }>(holidays: T[]): T[] => {
  if (!Array.isArray(holidays)) return [];

  return holidays.filter((holiday) => {
    if (!holiday.date) return false;
    const holidayDate = new Date(holiday.date);
    
    // Check if valid date
    if (!isValid(holidayDate)) return false;

    // Check if it's in current week
    if (!isInCurrentWeek(holidayDate)) {
      return false;
    }
    
    // Exclude Sundays
    if (isSunday(holidayDate)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Format holiday for display
 */
export const formatHolidayDisplay = (holiday: { date: string; reason?: string }): string => {
  if (!holiday.date) return "Invalid Date";
  const date = new Date(holiday.date);
  if (!isValid(date)) return "Invalid Date";

  const dayName = format(date, "EEEE"); // e.g., "Monday"
  const dateStr = format(date, "MMM dd"); // e.g., "Dec 09"
  const reason = holiday.reason || "Holiday";
  
  return `${dayName}, ${dateStr} - ${reason}`;
};
