import { startOfWeek, endOfWeek, format } from 'date-fns';

export const getWeekRange = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Lunes
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Domingo
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd')
  };
};