import { format, eachDayOfInterval, isSunday } from 'date-fns';
import { getSalaryMonthDates } from './salary';

export const getAllSundaysInMonth = (salaryMonthKey: string): string[] => {
  const { start, end } = getSalaryMonthDates(salaryMonthKey);
  
  const allDays = eachDayOfInterval({ start, end });
  const sundays = allDays.filter(day => isSunday(day));
  
  return sundays.map(day => format(day, 'yyyy-MM-dd'));
};

export const isSundayDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return isSunday(date);
};
