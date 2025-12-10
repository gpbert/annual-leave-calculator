import Holidays from 'date-holidays';
import { useMemo } from 'react';
import { format } from 'date-fns';

export function useHolidays(year) {
    const hd = useMemo(() => {
        const holidays = new Holidays('IT');
        return holidays;
    }, []);

    const getHolidaysForYear = (y) => {
        return hd.getHolidays(y);
    };

    const isHoliday = (date) => {
        // Pass string to avoid timezone shifts (e.g. 00:00 Local -> Previous Day UTC)
        const dateStr = date instanceof Date ? format(date, 'yyyy-MM-dd') : date;
        return hd.isHoliday(dateStr);
    };

    return {
        getHolidaysForYear,
        isHoliday
    };
}
