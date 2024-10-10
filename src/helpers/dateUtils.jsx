import { startOfWeek, endOfWeek, format } from 'date-fns';

export const getWeekRange = () => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 }); // Lunes
  const end = endOfWeek(now, { weekStartsOn: 1 }); // Domingo
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd')
  };
};